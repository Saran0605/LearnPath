package lecture5.InterfacesExample;

public class NiceCar{
    private Engine engine;
    private Media player;

    NiceCar(Engine engine,Media media){
        this.engine = engine;
        this.player = media;
    }

    public void start(){
        engine.start();
    }
    public void stop(){
        engine.stop();
    }
    public void acc(){
        engine.acc();
    }
    public void play(){
        player.start();
    }
    public void playStop(){
        player.stop();
    }
}
