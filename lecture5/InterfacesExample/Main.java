package lecture5.InterfacesExample;

public class Main {
    static void main() {
//        Car car = new Car();
//        car.start();
//        car.stop();
//
//        Media med = new Car();
//        //here if we stop the media it stops the car so make another class for media and implemnts media there
//
//        med.stop();

        NiceCar suv = new NiceCar(new ElectricEngine(),new Cdplayer());
        suv.start();
        suv.acc();
        suv.stop();
        suv.play();
        suv.playStop();
    }
}
