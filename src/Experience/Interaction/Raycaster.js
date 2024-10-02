import * as THREE from 'three'

export default class Raycaster {
    constructor(scene, camera) {
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.intersects = []
        this.scene = scene
        this.camera = camera

        window.addEventListener('mousemove', this.onMouseMove.bind(this))
        window.addEventListener('click', this.onClick.bind(this))
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.intersects = this.raycaster.intersectObjects(this.scene.children, true)
        this.currentIntersect = this.intersects[0]
        
        if (this.currentIntersect) {
            if(this.currentIntersect.object.name.includes('tower')) {
                console.log(`Hovering over tower ${this.currentIntersect.object.name}`)
                this.currentIntersect.object.visible = false
            }
        }
    }

    onClick() {
        // this.raycaster.setFromCamera(this.mouse, this.camera) // I don't think I need to set the raycaster again as the mouse will have moved to this location
        this.intersects = this.raycaster.intersectObjects(this.scene.children, true)

        this.currentIntersect = this.intersects[0]
    }
}