import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Tower
{
    constructor(model)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('tower')
        }

        // Resource
        this.model = model
        this.highlight = this.model.children[0];
        this.towerStack = this.resources.items.towerModel.scene.children[0].clone()
        this.towerStack.position.y += 100;
        this.model.add(this.towerStack);

        this.name = model.name
        this.state = 'empty'

        // this.setAnimation()
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
        if(currentHoverIntersect) {
            // hover highlight only needed on empty state
            if(this.state === 'empty') {
                // if the current hover intersect isn't this one - hide the highlight
                if(currentHoverIntersect.object.name !== this.name) {
                    this.highlight.visible = false;
                }
            }
        }

        // this.animation.mixer.update(this.time.delta * 0.001)
    }

    clicked() {
        if(this.state === 'empty') {
            // Move from empty state to built state
            this.state = 'built'
            this.towerStack.position.y -= 100;
            this.highlight.position.y += 100;
        }
    }
}