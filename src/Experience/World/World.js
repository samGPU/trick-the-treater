import Experience from '../Experience.js'
import Environment from './Environment.js'
import Level from './Level.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.level = new Level()
            this.environment = new Environment()
        })
    }

    update(currentIntersect)
    {
        if(this.level)
            this.level.update(currentIntersect)
    }
}