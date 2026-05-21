'use client'

// ali-v6 asterisk lab — interactive playground for sculpting the
// butterfly/asterisk pose. Each of the 3 coins has live sliders for
// x / y / z / scale / rotX / rotY / rotZ. The 3D scene updates as
// you drag. When you're happy, hit "Copy poses" to grab the values
// in the exact format used by CoinField.butterflyPoses and
// AliBridge.starPoses — paste them in and the live site matches.

import { useEffect, useRef, useState } from 'react'

type Pose = {
  x: number
  y: number
  z: number
  s: number
  // Rotations exposed in DEGREES in the UI for friendliness; converted to
  // radians for THREE.js inside the render loop.
  rxDeg: number
  ryDeg: number
  rzDeg: number
}

const INITIAL: Pose[] = [
  { x: 0, y: 0.05, z: -0.40, s: 1.5, rxDeg: 90, ryDeg: 2.29, rzDeg: 60 }, // STRATEGY
  { x: 0, y: 0.00, z: -0.34, s: 1.5, rxDeg: 90, ryDeg: 0, rzDeg: 0 }, // AI
  { x: 0, y: -0.05, z: -0.40, s: 1.5, rxDeg: 90, ryDeg: -2.29, rzDeg: -60 }, // EXECUTION
]

const COIN_LABELS = ['STRATEGY', 'AI', 'EXECUTION']
const COIN_COLORS = ['#1B4965', '#62B6CB', '#BEE9E8']
const COIN_LABEL_COLORS = ['#ffffff', '#ffffff', '#1B4965']

const deg = (d: number) => (d * Math.PI) / 180

export default function AsteriskLab() {
  const [poses, setPoses] = useState<Pose[]>(INITIAL)
  // Mirror of state in a ref so the render loop reads the latest values
  // without React re-renders.
  const posesRef = useRef<Pose[]>(INITIAL)
  posesRef.current = poses
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rigRotZ, setRigRotZ] = useState(0)
  const rigRotZRef = useRef(0)
  rigRotZRef.current = rigRotZ

  useEffect(() => {
    let disposed = false
    let frame = 0
    let cleanup = () => {}

    async function boot() {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')

      if (disposed || !canvasRef.current) return

      const w = canvasRef.current.clientWidth
      const h = canvasRef.current.clientHeight
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 80)
      camera.position.set(0, 0, 7)

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(w, h, false)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.08

      const pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      pmrem.dispose()

      scene.add(new THREE.AmbientLight(0xe8f0f8, 0.55))
      const key = new THREE.DirectionalLight(0xffffff, 5.5)
      key.position.set(4, 5.5, 6)
      scene.add(key)
      const cool = new THREE.PointLight(0x7aa8e8, 5.5, 30)
      cool.position.set(-5, -2, 5)
      scene.add(cool)
      const warm = new THREE.PointLight(0xf0d090, 3.2, 22)
      warm.position.set(6, 3, 3)
      scene.add(warm)
      const top = new THREE.DirectionalLight(0xd8e8f5, 1.8)
      top.position.set(0, 8, 2)
      scene.add(top)

      const rig = new THREE.Group()
      scene.add(rig)

      // Build the label texture matching the v6 engraving look so the
      // visuals match the live site exactly.
      const createLabelTexture = (label: string, fillColor: string) => {
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 256
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = fillColor
        ctx.font = `700 125px Arial, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 4)
        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.needsUpdate = true
        return tex
      }

      type CoinGroup = { outer: import('three').Group; inner: import('three').Group }
      const groups: CoinGroup[] = []

      new GLTFLoader().load('/silver_coin.glb', gltf => {
        if (disposed) return
        const proto = gltf.scene
        const box = new THREE.Box3().setFromObject(proto)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxAxis = Math.max(size.x, size.y, size.z) || 1
        const coinDepth = 0.35
        const faceZ = (size.z / maxAxis) * 0.71 * coinDepth + 0.012

        INITIAL.forEach((_, index) => {
          const outer = new THREE.Group()
          const inner = new THREE.Group()
          const model = proto.clone(true)

          const tint = new THREE.Color(COIN_COLORS[index])
          model.traverse(child => {
            const mesh = child as import('three').Mesh
            if (!mesh.isMesh || !mesh.material) return
            const apply = (m: import('three').Material) => {
              const c = m.clone() as import('three').MeshStandardMaterial
              if ('color' in c && c.color) c.color.copy(tint)
              c.needsUpdate = true
              return c
            }
            if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(apply)
            else mesh.material = apply(mesh.material)
          })

          const label = new THREE.Mesh(
            new THREE.PlaneGeometry(0.92, 0.22),
            new THREE.MeshBasicMaterial({
              map: createLabelTexture(COIN_LABELS[index], COIN_LABEL_COLORS[index]),
              transparent: true,
              depthWrite: false,
              side: THREE.DoubleSide,
            }),
          )

          model.position.sub(center)
          const normalizedScale = 1.42 / maxAxis
          model.scale.set(normalizedScale, normalizedScale, normalizedScale * coinDepth)
          label.position.z = faceZ
          inner.add(model)
          inner.add(label)
          outer.add(inner)
          rig.add(outer)
          groups.push({ outer, inner })
        })
      })

      const render = () => {
        frame = requestAnimationFrame(render)

        // Pull latest values from the state ref. No React re-render needed.
        rig.rotation.z = deg(rigRotZRef.current)

        groups.forEach((g, i) => {
          const p = posesRef.current[i]
          g.outer.position.set(p.x, p.y, p.z)
          g.outer.scale.setScalar(p.s)
          g.outer.rotation.set(0, 0, 0) // outer used only for rig orbit; coin rotation lives on inner
          g.inner.rotation.set(deg(p.rxDeg), deg(p.ryDeg), deg(p.rzDeg))
        })

        renderer.render(scene, camera)
      }

      const resize = () => {
        if (!canvasRef.current) return
        const w = canvasRef.current.clientWidth
        const h = canvasRef.current.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h, false)
      }

      window.addEventListener('resize', resize)
      render()

      cleanup = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        renderer.dispose()
      }
    }

    boot()
    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  const updatePose = (idx: number, key: keyof Pose, value: number) => {
    setPoses(prev => prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p)))
  }

  const reset = () => setPoses(INITIAL)
  const mirror = () => {
    // Copy coin 0 values to coin 2 mirrored (negate rzDeg, ryDeg, y)
    setPoses(prev => [
      prev[0],
      prev[1],
      {
        ...prev[2],
        x: prev[0].x,
        y: -prev[0].y,
        z: prev[0].z,
        s: prev[0].s,
        rxDeg: prev[0].rxDeg,
        ryDeg: -prev[0].ryDeg,
        rzDeg: -prev[0].rzDeg,
      },
    ])
  }

  const copyCode = () => {
    const formatted = poses
      .map(p => {
        const rx = (p.rxDeg / 180).toFixed(4).replace(/\.?0+$/, '')
        const ry = (p.ryDeg / 180).toFixed(4).replace(/\.?0+$/, '')
        const rz = (p.rzDeg / 180).toFixed(4).replace(/\.?0+$/, '')
        return `  { x: ${p.x}, y: ${p.y}, z: ${p.z}, s: ${p.s}, rx: Math.PI * ${rx}, ry: Math.PI * ${ry}, rz: Math.PI * ${rz} },`
      })
      .join('\n')
    const block = `const butterflyPoses: Pose[] = [\n${formatted}\n]`
    navigator.clipboard.writeText(block).catch(() => {})
    alert('Copied to clipboard.\n\n' + block)
  }

  return (
    <div style={S.page}>
      <div style={S.stage}>
        <canvas ref={canvasRef} style={S.canvas} />
      </div>

      <div style={S.panel}>
        <div style={S.header}>
          <h1 style={S.title}>Asterisk Lab</h1>
          <div style={S.actions}>
            <button onClick={reset} style={S.btn}>Reset</button>
            <button onClick={mirror} style={S.btn}>Mirror 0→2</button>
            <button onClick={copyCode} style={{ ...S.btn, ...S.primary }}>Copy poses</button>
          </div>
        </div>

        <div style={S.row}>
          <label style={S.label}>Rig spin (deg)</label>
          <input
            type="range"
            min="-360"
            max="360"
            step="1"
            value={rigRotZ}
            onChange={e => setRigRotZ(Number(e.target.value))}
            style={S.slider}
          />
          <span style={S.value}>{rigRotZ}°</span>
        </div>

        {poses.map((p, i) => (
          <div key={i} style={S.coinBlock}>
            <div style={{ ...S.coinHeader, color: COIN_COLORS[i] }}>{COIN_LABELS[i]}</div>
            {(
              [
                ['x', -3, 3, 0.01],
                ['y', -3, 3, 0.01],
                ['z', -3, 3, 0.01],
                ['s', 0.1, 4, 0.05],
                ['rxDeg', -180, 180, 1],
                ['ryDeg', -180, 180, 1],
                ['rzDeg', -180, 180, 1],
              ] as const
            ).map(([key, min, max, step]) => (
              <div key={key} style={S.row}>
                <label style={S.label}>{key}</label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={p[key]}
                  onChange={e => updatePose(i, key, Number(e.target.value))}
                  style={S.slider}
                />
                <input
                  type="number"
                  value={p[key]}
                  step={step}
                  onChange={e => updatePose(i, key, Number(e.target.value))}
                  style={S.numberInput}
                />
              </div>
            ))}
          </div>
        ))}

        <div style={S.tip}>
          Tip: when satisfied, hit <b>Copy poses</b> and paste the values into
          <code style={S.code}> CoinField.butterflyPoses</code> AND
          <code style={S.code}> AliBridge.starPoses</code> so the hero→bridge
          swap stays visually identical.
        </div>
      </div>
    </div>
  )
}

const S = {
  page: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    minHeight: '100vh',
    background: '#F8F6F2',
    color: '#0D0D0D',
    fontFamily: 'Literata, Georgia, serif',
  } as const,
  stage: {
    position: 'relative',
    overflow: 'hidden',
    background:
      'radial-gradient(circle at 50% 50%, #ffffff 0%, #f0eee9 70%, #e8e5de 100%)',
  } as const,
  canvas: { width: '100%', height: '100%', display: 'block' } as const,
  panel: {
    padding: '24px 22px',
    background: '#FBFAF6',
    borderLeft: '1px solid rgba(13,13,13,0.08)',
    overflowY: 'auto' as const,
    maxHeight: '100vh',
  } as const,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  } as const,
  title: { fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' } as const,
  actions: { display: 'flex', gap: 8 } as const,
  btn: {
    padding: '6px 12px',
    border: '1px solid rgba(13,13,13,0.16)',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: 'inherit',
  } as const,
  primary: { background: '#0D0D0D', color: '#fff', borderColor: '#0D0D0D' } as const,
  coinBlock: {
    padding: '14px 0',
    borderTop: '1px solid rgba(13,13,13,0.08)',
    marginTop: 6,
  } as const,
  coinHeader: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 10 } as const,
  row: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 80px',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  } as const,
  label: { fontSize: 11, color: '#6B6B6B', fontFamily: 'monospace' } as const,
  slider: { width: '100%' } as const,
  value: { fontSize: 11, fontFamily: 'monospace', color: '#0D0D0D' } as const,
  numberInput: {
    width: '100%',
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '3px 6px',
    border: '1px solid rgba(13,13,13,0.16)',
    borderRadius: 4,
    background: '#fff',
  } as const,
  tip: {
    marginTop: 20,
    padding: 12,
    background: 'rgba(98, 182, 203, 0.10)',
    borderRadius: 8,
    fontSize: 11,
    lineHeight: 1.5,
    color: '#1B4965',
  } as const,
  code: {
    background: 'rgba(13,13,13,0.08)',
    padding: '1px 5px',
    borderRadius: 3,
    fontSize: 10,
  } as const,
}
