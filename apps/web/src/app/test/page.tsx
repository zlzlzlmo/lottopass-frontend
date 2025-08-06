export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-700 mb-8">If you can see this styled text, Tailwind CSS is working!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Card 1</h2>
            <p className="text-gray-600">This is a test card with Tailwind styles.</p>
          </div>
          
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Card 2</h2>
            <p>Blue background with white text.</p>
          </div>
          
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Card 3</h2>
            <p>Green background with white text.</p>
          </div>
        </div>
        
        <div className="mt-8 flex gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Button 1
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Button 2
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Button 3
          </button>
        </div>
        
        <div className="mt-8">
          <div className="h-10 w-10 bg-yellow-400 rounded-full"></div>
          <p className="mt-2 text-sm text-gray-500">This should be a yellow circle (h-10 w-10)</p>
        </div>
      </div>
    </div>
  );
}