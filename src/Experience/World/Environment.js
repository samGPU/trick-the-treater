import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 0.5)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 20
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.shadow.camera = new THREE.OrthographicCamera( -20, 20, 20, -20, 0.5, 100 );
        this.sunLight.position.set(5, 10, 2)
        this.sunLight.target.position.set(0, 0, 0)
        this.scene.add(this.sunLight)

        // Debug
        if(this.debug.active)
        {
            // add a sunlight helper
            // const sunLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 1, '#ff0000')
            // this.scene.add(sunLightHelper)

            const helper = new THREE.CameraHelper( this.sunLight.shadow.camera );
            this.scene.add( helper );

            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(1)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 50)
                .max(50)
                .step(0.1)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(100)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 50)
                .max(50)
                .step(0.1)
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.backgroundMap = {}

        const pmremGenerator = new THREE.PMREMGenerator(this.experience.renderer.instance)
        pmremGenerator.compileEquirectangularShader()

        this.environmentMap = pmremGenerator.fromEquirectangular(this.resources.items.hdrLightingMapTexture).texture
        this.environmentMap.intensity = 0.4
        this.scene.environment = this.environmentMap

        this.backgroundMap = pmremGenerator.fromEquirectangular(this.resources.items.hdrEnvironmentMapTexture).texture
        this.scene.background = this.backgroundMap
        // this.scene.backgroundIntensity = 0.1
        this.scene.backgroundBlurriness = 0.5

        pmremGenerator.dispose()

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}