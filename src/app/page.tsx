export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">DaisyUI</h2>
          <p>If this card looks styled, DaisyUI is working.</p>

          <div className="card-actions justify-end">
            <button className="btn btn-primary">Primary</button>
          </div>
        </div>
      </div>
    </main>
  );
}