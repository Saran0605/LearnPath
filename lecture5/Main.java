package lecture5;
///abstract classes and interfaces
/// we should make our class like it says what to do but not how to do that
/// the super class only give the function definition not the body or what it does
/// these are called abstract methods
/// these abstract methods need to be override in child class
/// abstract void career(String name);  //no body
/// any class that has one or more abstract methods then the class need to be declared abstract
/// since it doesnt solve multiple inheritance we need interface
/// we cannont extend multiple classes in abstract class

abstract class Parent{
    abstract void career(String name);
    abstract void Partner(String name,int age);

    void name(){
        System.out.println("this is parent");
    }
}

/// we cannot create an object of an abstract class becaue there is no values for its methods
/// we need to override it
/// we cannot create an abstract constructor
/// we can create static methods in abstract classes
/// abstract classes can have normal methods.

class Son extends Parent{
    void career(String name){
        System.out.println("coder");
    }
    void Partner(String name,int age){
        System.out.println("yes");
    }
}
public class Main {
    static void main() {
        Son son = new Son();
        son.career("doctor");
    }
}
