export default class InteractionController {
    constructor(world) {
        this.world = world;
    }

    clickOnTower(tower) {
        console.log('clickOnTower', tower.name)
        const towerName = tower.name;
        this.world.level.TOWERS[towerName].clicked();
    }
}