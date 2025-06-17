// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export const ResumenBarberia = () => {
//   const [clientes, setClientes] = useState([]);
//   const [reservas, setReservas] = useState([]);
//   const [fecha, setFecha] = useState(() => {
//     const hoy = new Date();
//     const yyyy = hoy.getFullYear();
//     const mm = String(hoy.getMonth() + 1).padStart(2, '0');
//     const dd = String(hoy.getDate()).padStart(2, '0');
//     return `${yyyy}-${mm}-${dd}`;
//   });
//   const [error, setError] = useState('');
//   const [mostrarClientes, setMostrarClientes] = useState(false); 

//   useEffect(() => {
//     const fetchClientes = async () => {
//       try {
//         const { data } = await axios.get('https://back-barber-q7x2.onrender.com/clientes');
//         setClientes(data);
//       } catch (err) {
//         setError('Error cargando clientes');
//       }
//     };

//     fetchClientes();
//   }, []);

//   useEffect(() => {
//     const fetchReservasPorFecha = async () => {
//       if (!fecha) return;
//       try {
//         const { data } = await axios.get(`https://back-barber-q7x2.onrender.com/reservas/${fecha}`);
//         setReservas(data);
//       } catch (err) {
//         setError('Error cargando reservas');
//       }
//     };

//     fetchReservasPorFecha();
//   }, [fecha]);

//   const reservasPorBarbero = reservas.reduce((acc, reserva) => {
//     if (!acc[reserva.barbero]) acc[reserva.barbero] = [];
//     acc[reserva.barbero].push({ hora: reserva.hora, nombreCliente: reserva.nombreCliente });
//     return acc;
//   }, {});

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">Resumen de la Barbería</h2>

//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Reservas por Barbero</h3>
//         <input
//           type="date"
//           value={fecha}
//           onChange={(e) => setFecha(e.target.value)}
//           className="mb-4 p-2 border rounded"
//         />

//         {reservas.length === 0 ? (
//           <p className="text-gray-600">No hay reservas para este día.</p>
//         ) : (
//           Object.entries(reservasPorBarbero).map(([barbero, detalles]) => (
//             <div key={barbero} className="mt-4">
//               <h4 className="font-semibold">{barbero}</h4>
//               <ul className="list-disc ml-6">
//                 {detalles.map((r, i) => (
//                   <li key={i}>
//                     {r.hora} - {r.nombreCliente}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="mb-6">
//         <button
//           onClick={() => setMostrarClientes(!mostrarClientes)}
//           className="mb-2 bg-green-600 text-white px-4 py-2 rounded"
//         >
//           {mostrarClientes ? 'Ocultar Clientes' : 'Mostrar Clientes'}
//         </button>

//         {mostrarClientes && (
//           <>
//             <h3 className="text-lg font-semibold mb-2">Clientes y peluqueadas</h3>
//             <table className="w-full table-auto border">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border px-4 py-2 text-left">Celular</th>
//                   <th className="border px-4 py-2 text-left">Nombre</th>
//                   <th className="border px-4 py-2 text-left"># Peluqueadas</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {clientes.map((cliente) => (
//                   <tr key={cliente.numeroCelular}>
//                     <td className="border px-4 py-2">{cliente.numeroCelular}</td>
//                     <td className="border px-4 py-2">{cliente.nombreCliente}</td>
//                     <td className="border px-4 py-2">{cliente.peluqueadas}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//       {error && <p className="text-red-600">{error}</p>}
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const ResumenBarberia = () => {
  const [clientes, setClientes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [error, setError] = useState('');
  const [mostrarClientes, setMostrarClientes] = useState(false);

  // Estado del login
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    try {
      const response = await axios.post('https://back-barber-q7x2.onrender.com/login', {
        usuario,
        contrasena,
      });

      if (response.data.acceso) {
        setLogueado(true);
      } else {
        setErrorLogin('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setErrorLogin('Error al intentar iniciar sesión');
    }
  };

  // Datos si ya inició sesión
  useEffect(() => {
    if (!logueado) return;

    const fetchClientes = async () => {
      try {
        const { data } = await axios.get('https://back-barber-q7x2.onrender.com/clientes');
        setClientes(data);
      } catch (err) {
        setError('Error cargando clientes');
      }
    };

    fetchClientes();
  }, [logueado]);

  useEffect(() => {
    if (!logueado || !fecha) return;

    const fetchReservasPorFecha = async () => {
      try {
        const { data } = await axios.get(`https://back-barber-q7x2.onrender.com/reservas/${fecha}`);
        setReservas(data);
      } catch (err) {
        setError('Error cargando reservas');
      }
    };

    fetchReservasPorFecha();
  }, [fecha, logueado]);

  const reservasPorBarbero = reservas.reduce((acc, reserva) => {
    if (!acc[reserva.barbero]) acc[reserva.barbero] = [];
    acc[reserva.barbero].push({ hora: reserva.hora, nombreCliente: reserva.nombreCliente });
    return acc;
  }, {});

  // Mostrar solo login si no está autenticado
  if (!logueado) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1">Usuario:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Contraseña:</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Iniciar sesión
          </button>
          {errorLogin && <p className="text-red-600 mt-2">{errorLogin}</p>}
        </form>
      </div>
    );
  }

  // Interfaz principal si ya está logueado
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Resumen de la Barbería</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Reservas por Barbero</h3>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        {reservas.length === 0 ? (
          <p className="text-gray-600">No hay reservas para este día.</p>
        ) : (
          Object.entries(reservasPorBarbero).map(([barbero, detalles]) => (
            <div key={barbero} className="mt-4">
              <h4 className="font-semibold">{barbero}</h4>
              <ul className="list-disc ml-6">
                {detalles.map((r, i) => (
                  <li key={i}>
                    {r.hora} - {r.nombreCliente}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={() => setMostrarClientes(!mostrarClientes)}
          className="mb-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          {mostrarClientes ? 'Ocultar Clientes' : 'Mostrar Clientes'}
        </button>

        {mostrarClientes && (
          <>
            <h3 className="text-lg font-semibold mb-2">Clientes y peluqueadas</h3>
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Celular</th>
                  <th className="border px-4 py-2 text-left">Nombre</th>
                  <th className="border px-4 py-2 text-left"># Peluqueadas</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.numeroCelular}>
                    <td className="border px-4 py-2">{cliente.numeroCelular}</td>
                    <td className="border px-4 py-2">{cliente.nombreCliente}</td>
                    <td className="border px-4 py-2">{cliente.peluqueadas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};
