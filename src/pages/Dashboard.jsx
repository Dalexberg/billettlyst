export default function Dashboard() {
  return (
    <main>
      <h1>Logg inn</h1>
      <form>
        <label>
          E-post:
          <input type="email" />
        </label>
        <br />
        <label>
          Passord:
          <input type="password" />
        </label>
        <br />
        <button type="submit">Logg inn</button>
      </form>
    </main>
  )
}