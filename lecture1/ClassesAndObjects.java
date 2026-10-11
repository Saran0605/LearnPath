package lecture1;

class Student{
    // our own kind of data types can store some values
    // with properties
    // here for class(data type) Student - properties(name,age,roll)
    // named group of properties(variables) and functions(methods)
    // can be a template - used by many objects

    String name; // default - null
    int age; // default - 0
    int roll;


    //this keyword
    //one word to access every object
    // this keyword replaces object name which it calls from si instead of naming it in constructor using this
    // only usage is when with name conflicts
    //even without this it works smoothly

    Student(){
        this.age = 10; // custom values by parameters
        this.name =  "saran";
        this.roll=  90;
    }

    //constructor can be of n times based on parameters
    //comes under polymorphism
}

public class ClassesAndObjects {
    static void main() {

        Student saran = new Student();
        // here saran is the object a real physical instance
        // but the class is just rules or property not a real entity
        // class - (logical construct)
        // object - (this is physical reality) - which occupies space in memory
        Student suthir = new Student();
        Student vishal = new Student();

        // every object is individual physical entity with common structure of its derived class template


        // variables
        // declared inside the class for particular object - instance variable
        // used to refer a particular object - reference variable



        //object creation
        //just declaring a reference varaible
        Student stud1;
        // it will be null no init
        stud1 = new Student();
        //now will create new object in memory maps with that reerence variable


        //dynamic memory allocation
        Student stud2                =        new Student();
        //this will be in compile time          this will be run time
        //only allocates memory in run time

        //constructors
        // helps in assigning values to instance variables
        // do something when object creates


    }

    public void hello(){
        System.out.println("hii");
    }

}
