import { createSchema, list } from '@keystone-next/keystone';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  image,
  file
} from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';

const vinlib = require('@stsier/vinlib');


export const lists = createSchema({
  
  User: list({

    ui: {
      listView: {
        initialColumns: ['name', 'wines'],
      },  
    },
    fields: {
      
      name: text({ isRequired: true }),
      email: text({
        isRequired: true,
        isIndexed: 'unique',
        isFilterable: true,
        
      }),
      password: password({ isRequired: true }),
      wines: relationship({ ref: 'Wine.author', many: true }),
    },

  }),
  Wine: list({
    fields: {
      title: text({ 
 
      }),
      photo: image({
        
      }),
      sift: file(),
      status: select({
        options: [
          { label: 'Sift ready', value: 'ready' },
          { label: 'Sift processing', value: 'processing' },
          { label: 'Sift error', value: 'error' },
          { label: 'Sift empty', value: 'empty' },
        ],
        defaultValue : 'empty', 
        ui: {
          //displayMode: 'segmented-control',
        },
        hooks: { 
          validateInput: ({  operation, fieldKey, resolvedData , context }) => {
            const { title } = resolvedData;
            console.log("------Resolve Field-----");

            console.log("fieldKey : " + Object.keys(resolvedData));

            console.log("fieldKey : " + resolvedData.status);

            resolvedData.status = "processing";

            vinlib.start();
        
          },
        }
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      author: relationship({
        ref: 'User.wines',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email'] },
        },
      }),
      tags: relationship({
        ref: 'Tag.wines',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
      
    },
    hooks: {
      
      resolveInput: ({  operation, listKey, resolvedData , context }) => {
        const { title } = resolvedData;
        console.log("------Resolve-----");
        console.log("operartion : " + operation);
        console.log("photo : " + resolvedData.photo.id);
        console.log("sift : " + resolvedData.sift.id);
        console.log("status : " + resolvedData.status);
       // console.log("context : " + context.session?);
        
        if (title) {
          //resolvedData.sift = 
          // Ensure the first letter of the title is capitalised
          resolvedData.title = title[0].toUpperCase() + title.slice(1)
        }
        if(operation == "create") {
          resolvedData.status == "processing";
        }
        else if(operation == "update") {
          resolvedData.status == "ready";
        }
        // We always return resolvedData from the resolveInput hook
        return resolvedData;
      },
      validateInput: async ({  listKey, operation, context , resolvedData, addValidationError}) => {
        const { title } = resolvedData; 
        
        console.log("------Validate-----");
       
        console.log("operartion : " + operation);
        console.log("photo : " + resolvedData.photo.id);
        console.log("sift : " + resolvedData.sift.id);
        console.log("status : " + resolvedData.status);
       // console.log("context : " + JSON.stringify(context));
       // console.log("context : " + context.session?);
        
        if (title) {
          //resolvedData.sift = 
          // Ensure the first letter of the title is capitalised
          resolvedData.title = title[0].toUpperCase() + title.slice(1)
        }
        if(operation == "create") {
          resolvedData.status == "processing";
        }
        else if(operation == "update") {
          resolvedData.status == "ready";
        }
        // We always return resolvedData from the resolveInput hook
      //  return resolvedData;
      },
    },
  }),
  Tag: list({
    ui: {
      isHidden: false,
    },
    fields: {
      name: text(),
      wines: relationship({
        ref: 'Wine.tags',
        many: true,
      }),
    },
  }),
  
});



/*
operartion : update
photo : extension,filesize,height,id,mode,width
sift : mode,filename,filesize
context : schemaName,db,lists,totalResults,prisma,graphql,maxTotalResults,sudo,exitSudo,withSession,req,session,startSession,endSession,gqlNames,images,files,_extensionStack
*/