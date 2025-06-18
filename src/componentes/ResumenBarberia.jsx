import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './../assets/logo.jpg'
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
  const [mostrarDisponibilidad, setMostrarDisponibilidad] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  const [barbero, setBarbero] = useState('');
  const [fechaDisp, setFechaDisp] = useState(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [horasTexto, setHorasTexto] = useState('');
  const [mensajeDisp, setMensajeDisp] = useState('');

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

  const enviarDisponibilidad = async (e) => {
    e.preventDefault();
    setMensajeDisp('');
    const horasArray = horasTexto.split(',').map(h => h.trim());

    try {
      await axios.post('https://back-barber-q7x2.onrender.com/disponibilidad', {
        barbero,
        fecha: fechaDisp,
        horas: horasArray
      });
      setMensajeDisp('Disponibilidad guardada correctamente');
      setHorasTexto('');
    } catch (err) {
      setMensajeDisp('Error al guardar disponibilidad');
    }
  };

  const reservasPorBarbero = reservas.reduce((acc, reserva) => {
    if (!acc[reserva.barbero]) acc[reserva.barbero] = [];
    acc[reserva.barbero].push({
      hora: reserva.hora,
      nombreCliente: reserva.nombreCliente,
      numeroCelular: reserva.numeroCelular,
      fecha: reserva.fecha,
      barbero: reserva.barbero
    });
    return acc;
  }, {});


  const eliminarReserva = async (reserva) => {
    try {
      // await axios.post('https://back-barber-q7x2.onrender.com/eliminarReserva', {
      await axios.post('https://back-barber-q7x2.onrender.com/eliminarReserva', {

        barbero: reserva.barbero,
        fecha: reserva.fecha,
        hora: reserva.hora,
        numeroCelular: reserva.numeroCelular
      });
      // Actualiza reservas después de eliminar
      setReservas((prev) =>
        prev.filter(
          (r) =>
            !(
              r.barbero === reserva.barbero &&
              r.fecha === reserva.fecha &&
              r.hora === reserva.hora &&
              r.numeroCelular === reserva.numeroCelular
            )
        )
      );
    } catch (error) {
      console.error('Error eliminando reserva', error);
    }
  };


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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Logo de la barbería" className="h-28" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Resumen de la Barbería</h2>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <label className="font-medium">Seleccionar fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="p-2 border rounded shadow-sm w-full sm:w-auto"
          />
        </div>

        {reservas.length === 0 ? (
          <p className="text-gray-600 text-center">No hay reservas para este día.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(reservasPorBarbero).map(([barbero, detalles]) => (
              <div key={barbero} className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
                <h4 className="text-xl font-semibold text-green-700 mb-3 border-b pb-2">{barbero}</h4>
                <ul className="space-y-2">
                  {detalles.map((r, i) => (
                    <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded shadow-sm">
                      <div>
                        <span className="font-medium">{r.hora}</span> - {r.nombreCliente}
                        <br />
                        <span className="text-sm text-gray-600">{r.numeroCelular}</span>
                      </div>

                      <div className="flex gap-2">

                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          onClick={() => eliminarReserva({
                            barbero,
                            fecha,
                            hora: r.hora,
                            numeroCelular: r.numeroCelular // debes incluir este dato en `reservasPorBarbero`
                          })}
                        >
                          Eliminar reserva
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="mb-6">
        <button
          onClick={() => setMostrarDisponibilidad(!mostrarDisponibilidad)}
          className="mb-2 bg-green-600 text-white px-4 py-2 rounded w-full sm:w-64"
        >
          {mostrarDisponibilidad ? 'Ocultar Formulario' : 'Añadir Disponibilidad'}
        </button>

        {mostrarDisponibilidad && (
          <>
            <h3 className="text-lg font-semibold mb-2">Formulario de Disponibilidad</h3>
            <form onSubmit={enviarDisponibilidad} className="space-y-4">
              <div>
                <label className="block mb-1">Barbero (Juan o Camilo):</label>
                <select
                  value={barbero}
                  onChange={(e) => setBarbero(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Selecciona un barbero</option>
                  <option value="Juan">Juan</option>
                  <option value="Camilo">Camilo</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Fecha:</label>
                <input
                  type="date"
                  value={fechaDisp}
                  onChange={(e) => setFechaDisp(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Horas (separadas por coma, ej: 08:00, 08:30):</label>
                <input
                  type="text"
                  value={horasTexto}
                  onChange={(e) => setHorasTexto(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Guardar Disponibilidad
              </button>
              {mensajeDisp && <p className="text-green-600 mt-2">{mensajeDisp}</p>}
            </form>
          </>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={() => setMostrarClientes(!mostrarClientes)}
          className="mb-2 bg-green-600 text-white px-4 py-2 rounded w-full sm:w-64"
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
