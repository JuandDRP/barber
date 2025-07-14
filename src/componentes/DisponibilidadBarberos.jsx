import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logo from './../assets/logo.jpg';
import ig2 from './../assets/ig2.png';
import './DisponibilidadBarberos.css';
const barberos = ['Camilo', 'Juan'];

export const DisponibilidadBarberos = () => {
    const [numeroCelular, setNumeroCelular] = useState('');
    const [fecha, setFecha] = useState(() => {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [disponibilidad, setDisponibilidad] = useState({});
    const [seleccion, setSeleccion] = useState({});
    const [nombreCliente, setNombreCliente] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const manejarCambioFecha = (e) => {
        setFecha(e.target.value);
        setSeleccion({});
        setMensaje('');
        setError('');
    };

    const seleccionarHora = (barbero, hora) => {
        setSeleccion((prev) => ({ ...prev, [barbero]: hora }));
        setMensaje('');
        setError('');
    };

    const hacerReserva = async (barbero) => {
        if (!nombreCliente || !numeroCelular || !seleccion[barbero] || !fecha) {
            return setError('Debes ingresar tu nombre, celular y seleccionar una hora.');
        }

        try {
            const res = await axios.post('https://back-barber-q7x2.onrender.com/reservar', {
                nombreCliente,
                numeroCelular,
                barbero,
                fecha,
                hora: seleccion[barbero],
            });

            const esCorteGratis = res.data.peluqueadas === 7;

            setMensaje(
                `Reserva confirmada con ${barbero} a las ${seleccion[barbero]}` +
                (esCorteGratis ? ' 🎉 ¡Este corte es gratuito por ser tu número 7!' : `, este es tu corte #${res.data.peluqueadas}`)
            );
            setError('');
            setSeleccion((prev) => ({ ...prev, [barbero]: '' }));
            cargarDisponibilidad();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al hacer la reserva');
        }
    };



    // const cargarDisponibilidad = useCallback(async () => {
    //     if (!fecha) return;

    //     setCargando(true);
    //     setError('');
    //     const nuevaDisponibilidad = {};

    //     for (const barbero of barberos) {
    //         try {
    //             const { data } = await axios.get(
    //                 `https://back-barber-q7x2.onrender.com/disponibilidad/${barbero}/${fecha}`
    //             );
    //             nuevaDisponibilidad[barbero] = data.disponibles;
    //         } catch (err) {
    //             console.warn(`No hay disponibilidad para ${barbero}`);
    //             nuevaDisponibilidad[barbero] = [];
    //         }
    //     }

    //     setDisponibilidad(nuevaDisponibilidad);
    //     setCargando(false);
    // }, [fecha]);
    const cargarDisponibilidad = useCallback(async () => {
        if (!fecha) return;

        setCargando(true);
        setError('');

        try {
            const respuestas = await Promise.all(
                barberos.map((barbero) =>
                    axios.get(`https://back-barber-q7x2.onrender.com/disponibilidad/${barbero}/${fecha}`)
                        .then((res) => ({ barbero, data: res.data.disponibles }))
                        .catch(() => ({ barbero, data: [] }))
                )
            );

            const nuevaDisponibilidad = {};
            respuestas.forEach(({ barbero, data }) => {
                nuevaDisponibilidad[barbero] = data;
            });

            setDisponibilidad(nuevaDisponibilidad);
        } catch (err) {
            console.error('Error cargando disponibilidad:', err);
            setError('Error al cargar la disponibilidad');
        }

        setCargando(false);
    }, [fecha]);



    useEffect(() => {
        cargarDisponibilidad();
    }, [cargarDisponibilidad]);

    return (
        <div className="min-h-screen p-2">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"></link>
            <div className="max-w-4xl mx-auto rounded-2xl shadow-lg p-4 border border-gray-200">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo de la barbería" className="h-40 w-40 rounded-full object-cover mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-center text-white mb-8 uppercase tracking-wide">
                    Agenda tu Cita
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Nombre del Cliente</label>
                        <input
                            type="text"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                            placeholder="Nombre y apellido"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Celular</label>
                        <input
                            type="tel"
                            value={numeroCelular}
                            onChange={(e) => setNumeroCelular(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                            placeholder="Número de celular"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Fecha</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={manejarCambioFecha}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                        />
                    </div>
                </div>
                {cargando && <p className="text-gray-500 italic">Cargando disponibilidad...</p>}
                {error && <p className="text-red-600 font-medium">{error}</p>}
                {mensaje && <p className="text-green-600 font-bold text-lg mt-4 text-center">{mensaje}</p>}

                {!cargando && fecha && (
                    <div className="space-y-8 mt-8">
                        {barberos.map((barbero) => (
                            <div
                                key={barbero}
                                className="p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-sm"
                            >
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">{barbero}</h3>

                                {disponibilidad[barbero]?.length > 0 ? (
                                    <>
                                        <div className="flex flex-wrap gap-3">
                                            {disponibilidad[barbero].map((hora) => (
                                                <button
                                                    key={hora}
                                                    onClick={() => seleccionarHora(barbero, hora)}
                                                    className={`w-24 text-center px-4 py-2 rounded-md text-sm border transition ${seleccion[barbero] === hora
                                                        ? 'bg-gray-800 text-white border-gray-800'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {hora}
                                                </button>
                                            ))}
                                        </div>

                                        {seleccion[barbero] && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => hacerReserva(barbero)}
                                                    className="bg-gray-800 text-white px-6 py-2 rounded-md font-medium shadow hover:bg-gray-900 transition"
                                                >
                                                    Reservar a las {seleccion[barbero]}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-500 italic">No hay horas disponibles para este barbero, contáctanos por whatsapp para más información</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <a href="https://wa.me/573156757345?text=Hola%2C%20que%20disponibilidad%20tienes" class="float" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-whatsapp my-float"></i>
            </a>
            <a href="https://www.instagram.com/barberia_luxury19" class="float2" target="_blank" rel="noopener noreferrer">
                <img src={ig2} alt="Instagram" />
            </a>
        </div>
    );


};
