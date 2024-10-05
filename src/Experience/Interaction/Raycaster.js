import * as THREE from 'three'

export default class Raycaster {
    constructor(scene, camera, interactionController) {
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.intersects = []
        this.scene = scene
        this.camera = camera
        this.interactionController = interactionController;

        this.currentIntersect = null;

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
            // if it is a tower, highlight it
            if(this.currentIntersect.object.name.includes('-tower-')) {
                // set the highlight child mesh to be visible
                this.currentIntersect.object.children[0].visible = true
            }
        }
    }

    onClick() {
        if(this.currentIntersect) {
            if(this.currentIntersect.object.name.includes('-tower-')) {
                this.interactionController.clickOnTower(this.currentIntersect.object);
            }
        }
    }
}