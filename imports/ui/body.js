import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';


import './task.js';
import './body.html';


Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
})
 
Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if(instance.state.get('hideCompleted', event.target.checked)) {
      //If hide completed is checked, filter task
      return Tasks.find({ checked: { $ne: true} }, { sort : { createdAt: -1 } });
    }
    // Otherwise, return all the tasks 
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount(){
    return Tasks.find( { checked :  {$ne: true}}).count();
  }
});

//Event handler for form submit
Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
    Meteor.call('tasks.insert', text);
 
    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked)
  },
});