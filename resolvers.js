const db = require('./db')
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub(); //create a PubSub instance
const STUDENT_ADDED_TOPIC = 'newStudent';
const Query = {
    test: () => 'Test Success, GraphQL server is up & running !!',
    greeting:() => {
       return "hello from  GraphQL server !!!"
    },
    students:() => db.students.list(),
    //resolver function with arguments and returning object
   studentById:(root,args,context,info) => {
   return db.students.get(args.id);
}
 }

 const Mutation = {
   createStudent:(root,args,context,info) => {
      return db.students.create({
      collegeId:args.collegeId,
      firstName:args.firstName,
      lastName:args.lastName})
   },

   // new resolver function
   addStudent_returns_object:(root,args,context,info) => {
      const newStudent = {
         collegeId:args.collegeId,
         firstName:args.firstName,
         lastName:args.lastName
      };
      const id = db.students.create(newStudent);
      pubsub.publish(STUDENT_ADDED_TOPIC, { StudentAdded: db.students.get(id) });  // publish to a topic

      return db.students.get(id)
   }
}
const Subscription = {
   StudentAdded: {  // create a StudentAdded subscription resolver function.
    subscribe: () => pubsub.asyncIterator(STUDENT_ADDED_TOPIC)  // subscribe to changes in a topic
  }
}

//for each single student object returned,resolver is invoked
const Student = {
   college:(root) => {
      return db.colleges.get(root.collegeId);
   }
}
 module.exports = {Query,Mutation,Subscription}