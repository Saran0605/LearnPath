package lecture3;
///1 - oop property inheritance
/// parent ----> children(can use those things of their parents)
/// (base)------>(inherited or child)
/// using the extends keyword
/// class Child extends Base{}

class Box{
    static double l = 25;
    double h;
    double w;
    Box() {
        this.h = -1;
        this.w = -1;
    }
    Box(double side){
        this.w = side;
        this.h = side;
    }

    public void display(){
        System.out.println(l + " " + h + " "+ w);
    }
}

class BoxWeight extends Box{
    double weight;

    BoxWeight(){
        this.weight = 100;
    }

    public BoxWeight(double side, double weight) {
        super(side);// initialize the parent constructor
        this.weight = weight;
    }

    public void display(){
        System.out.println("override displat method");
    }
}
public class Inheritance {
    static void main() {
////        Box box = new Box(24);
////        Box box2 = new Box();
////        box.display();
////        box2.display();
//
//        BoxWeight bw = new BoxWeight();
////        bw.l = 200;
//        Box.l = 900;
//
//        BoxWeight bw2 = new BoxWeight();
//        bw.display();
//        bw2.display();
//
//        BoxWeight bw3 = new BoxWeight(30000,9999);
//        System.out.println(bw3.weight);
//        bw3.display();

        Box box5 = new BoxWeight(2,5);
        // we can only access all the members from super class alone
        // as only child classes can give values to upper guys, so we can do reference of parent andd object of child
        // but not referece of child with object of the parent(he wont knows what the heck in childrens)
        //but child knows as it contains super
        //upward motion works downwards wont
        // so it cant BoxWeight bw = new Box() // gives error

        box5.display();
        System.out.println(box5.h);
    }
}
