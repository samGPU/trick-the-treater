import * as THREE from 'three'
import Experience from '../Experience.js'
import Tower from './Tower.js'

export default class Level
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Level')
        }

        // Resource
        this.resource = this.resources.items.levelModel
        this.turretStack = null;

        this.TOWERS = {}
        this.HIGHLIGHTS = {}

        this.setModel()
        // this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.rotation.y = Math.PI * 0.5
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            // console.log(child.name, child)
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                if(!child.name.includes('path')) {
                    child.receiveShadow = true
                }

                if(child.name.includes('-tower-')) {
                    // Set the material to transparent
                    child.material.transparent = true
                    // Set the highlight child mesh to be invisible
                    child.children[0].visible = false

                    // Add the tower to the TOWERS object
                    this.TOWERS[child.name] = new Tower(child)
                    // Add the highlight to the HIGHLIGHTS object
                    this.HIGHLIGHTS[child.name] = child.children[0]
                }

                if(child.name === 'structure') {
                    this.turretStack = child;
                }
            }
        })

        console.log(this.turretStack)
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update(currentHoverIntersect)
    {
        // Get the current tower that is being hovered
        let currentTower;
        if(currentHoverIntersect && currentHoverIntersect.object.name) {
            currentTower = this.TOWERS[currentHoverIntersect.object.name]
        }

        // Update each tower
        for(const key in this.TOWERS) {
            this.TOWERS[key].update(currentHoverIntersect)
        }
    }
}