import e = require("express");
import { PrismaClient } from "./generated/prisma";
import { eventNames, title } from "process";
const prisma = new PrismaClient();

//you can log all the queries this way
// const prisma = new PrismaClient({log:["query"]});

async function main() {
  // const user = await prisma.user.deleteMany()

  // const user = await prisma.user.create({data:{name:"Jashan"}})
  // await prisma.user.deleteMany();



  //there is connect and disconnect

  const lal=await prisma.user.update({
    where:{
      email:"kyle@test.com"
    },
    data:{
      userPreference:{
        // disconnect:true
        connect:{
          //there will be id at this field
          id:"",
        },
      },
    },
  })

  console.log(lal);


  //updateMany
  const haha = await prisma.user.update({
    where:{
      email:"sally@test.com",
    },
    data:{
      email:"sally@test3.com"
    },
  })
  
  console.log(haha,"sfdhkljfaks");
  
  
  
  //findMany
  const users=await prisma.user.findMany({
    where:{
      writtenPosts:{
        every:{
          title:""
        }
      }

      // AND:[
      //   {email:{startsWith:"kyle"}},{email:{endsWith:"@gmail.com"}}
      // ]

      // name:{not:"sally"}
      // name:{in:["sally","kyle"]}
      // name:{notIn:["sally","kyle"]},

      // email:{contains:"@test.com"},
      // email:{startsWith:"@test.com"}
      //less than
      // age:{lt:20}
      // name:{equals:"sally"}
      // email:"kyle@gmail.com"
      // age_name:
      // {
      //   age:27,
      //   name:"kyle"
      // },
    },
    orderBy:{
      age:"asc",
    }
    // distinct:["name","age"],.
    // take:2,
    // skip:1
  })

  // const user = await prisma.user.createMany({
  //   data: [
  //     {
  //       name: "kyle",
  //       email: "kyle@gmail.com",
  //       age: 27,
  //     },
  //     {
  //       name: "sally",
  //       email: "sally@test.com",
  //       age: 32,
  //     },
  //    ],
    //you can use one of select and include at once
    //they both dont work with createMany but with create
    //  select:{
    //   name:true,
    //   userPreference:{select:{id:true}}
    //  }

    //  include:{
    //   userPreference:true,
    //  },
  // });
  console.log(users);
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
