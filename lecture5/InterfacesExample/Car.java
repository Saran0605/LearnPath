package lecture5.InterfacesExample;

public class Car implements Brake,Engine,Media{
    @Override
    public void brake() {
        System.out.println("i brake like a normal car");
    }

    @Override
    public void start() {
        System.out.println("car starts");
    }

    @Override
    public void stop() {
        System.out.println("car stops");
    }

    @Override
    public void acc() {
        System.out.println("accelrates");
    }

    public void brand(String name){
        System.out.println("toyota");
    }
}
