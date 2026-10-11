// contains learning of packages,static,Singleton class,In built method


package lecture2;
class Student{
    String name;
    int roll;


    Student(String name,int roll){
        this.name = name;
        this.roll = roll;
    }
}
public class PackagesAndOthers {
    static void main() {
        //1 - Packages
        // they are just containers to store classes
        // just a folder with some properties while accessing



        //2 - static variables in java
        // what if there is a common property for all objects
        // that will not depend on any objects
        // it is object independent

        // its work wiht both this. and className.
        // but conventions use className
        // the static member can be accessed without any object created

        //3 - Static methods
        //psvm - its need to be static to run initally

        // static methods can only access static data
        //if i call greeting which is not static from a static method psvm it wont worl

        // static is vegeterian  -  eats only veg
        // non statics are non vegeterians - who eate both
        // we cannont use this keyword inside static

        // static block
        // which runs only once when class loaded
        // can be used in case of assigning values to static variables
        // static {}



    }
    // this method depends on object
    void greeting() {
        System.out.println("hii");
    }

}
