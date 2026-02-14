import StaticExample from './components/modal'

export default function About() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>
          <span>Hello darkness my old friend</span>
          <br />
          <span>So, undemployed!</span>
          <br />
          <span>Again :(</span>
          <br />
          <span>Rediscover and improve</span>
          <br />
          <span>HELLOW WORLD I AM ALIVE</span>
          <br />
        </h1>
      </main>
      <StaticExample />
    </div>
  )
}
