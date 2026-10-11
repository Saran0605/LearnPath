package lecture2;

public class Singleton {
    // a class will have only one object
    // we need to stop usage of constructor
    // so make private
    private Singleton() {
        System.out.println("created");
    }
    private static Singleton instance;
    public static Singleton getInstance() {
        if(instance == null){
            instance = new Singleton();
        }
        return instance;
    }
}

