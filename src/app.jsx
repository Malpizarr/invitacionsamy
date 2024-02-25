import { h, Component, render } from 'preact';
import SimpleFlower from "./components/SimpleFlower.jsx";
import {useEffect, useRef, useState} from "preact/hooks";
import './app.css';
// Componente AnimatedSection para manejar la visibilidad y animación
function AnimatedText({ children, style }) {
    const textRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated-text');
                } else {
                    entry.target.classList.remove('animated-text');
                }
            },
            {
                threshold: 0.5,
            }
        );

        if (textRef.current) {
            observer.observe(textRef.current);
        }

        return () => {
            if (textRef.current) {
                observer.unobserve(textRef.current);
            }
        };
    }, []);

    // Combina el estilo propuesto con los estilos dinámicos
    return <h1 ref={textRef} style={style}>{children}</h1>;
}
function Popup({ show, onClose }) {
    if (!show) {
        return null;
    }

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const contentStyle = {
        backgroundColor: '#b09f8e',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        marginTop: '15px',
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={contentStyle} onClick={e => e.stopPropagation()}>
                <h2 style={{textAlign: 'center', fontSize: '24px', marginBottom: '15px', fontFamily: "'Dancing Script', cursive",  textShadow: '0 0 10px #000000',}}
                >Confirmación Exitosa ¡Te esperamos!</h2>
                <button style={buttonStyle} onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}




export function App() {
    const [nombre, setNombre] = useState('');
    const [confirmados, setConfirmados] = useState(1);
    const [numero, setNumero] = useState('');
    const [codigoPais, setCodigoPais] = useState('+506'); // Predeterminado a Costa Rica
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showPopup, setShowPopup] = useState(false); // Estado para controlar la visibilidad del pop-up

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'nombre':
                setNombre(value);
                break;
            case 'confirmados':
                setConfirmados(value);
                break;
            case 'numero':
                setNumero(value);
                break;
            case 'codigoPais':
                setCodigoPais(value);
                break;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const numeroCompleto = `${codigoPais}${numero}`; // Concatena el código de país con el número

        const reservacionData = {
            nombre,
            confirmados,
            numero: numeroCompleto,
        };

        try {
            const response = await fetch('https://invitacionsamy-72bcea589ccc.herokuapp.com/user/CrearReservacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservacionData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            setShowPopup(true);
            const result = await response.json();
            console.log(result);

        } catch (error) {
            console.error('Error al enviar los datos del formulario:', error);
        }
    };

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Función para obtener el tamaño de fuente según el ancho de la ventana
    const responsiveFontSize = (largeSize, mediumSize, smallSize) => {
        if (windowWidth >= 1024) return largeSize; // para pantallas grandes
        if (windowWidth >= 768) return mediumSize; // para pantallas medianas
        return smallSize; // para pantallas pequeñas
    };

    return (
        <div style={{scrollSnapType: 'y mandatory', overflowY: 'scroll', height: '100vh'}}>
            <section style={{
                position: 'relative',
                backgroundColor: '#c2b49a',
                backgroundImage: 'url("/assets/a9e4732d4bbc228fc2abc2206f84f5cb.png")',
                backgroundSize: "2500px 2500px",
                scrollSnapAlign: 'start',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#ffffff',
                    textShadow: '0 0 10px #000000',
                    fontSize: responsiveFontSize('6rem', '5rem', '4rem'),
                    padding: '10px',
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                }}>Reserva esta fecha</AnimatedText>
            </section>
            <section style={{
                backgroundImage: 'url("/assets/marco-flor-margarita-sobre-fondo-verde-claro_53876-101005.png")',
                scrollSnapAlign: 'start',
                backgroundSize: 'cover',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column', // Cambio clave aquí
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5'
            }}>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#fcfcfc',
                    textShadow: '0 0 10px #000000',
                    fontSize: responsiveFontSize('6rem', '5rem', '4rem'),
                    padding: '10px',
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive"

                }}>Por mis 15</AnimatedText>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#ffffff',
                    textShadow: '0 0 10px #000000',
                    fontSize: responsiveFontSize('6rem', '5rem', '4rem'),
                    padding: '10px',
                    borderRadius: '10px',
                    marginTop: '15px',
                    fontFamily: "'Dancing Script', cursive"
                }}>
                    Samy Alpízar
                </AnimatedText>
            </section>
            <section style={{
                scrollSnapAlign: 'start',
                backgroundImage: 'url(/assets/pngtree-beige-daisy-flower-page-border-image_13368886.jpg)',
                backgroundSize: 'cover',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column', // Cambio clave aquí
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5'

            }}>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                }}
                >SÁBADO</AnimatedText>
                <h2 style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    flexDirection: 'column', // Cambio clave aquí
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                }}
                >27/04/2024</h2>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    flexDirection: 'column', // Cambio clave aquí
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                }}
                >4 P.M</AnimatedText>
            </section>
            <section style={{
                backgroundImage: 'url(/assets/floral-daisy-flower-page-border-vector.jpg)',
                scrollSnapAlign: 'start',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column', // Cambio clave aquí
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff'
            }}>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                    marginBottom: '10px'
                }}
                >Villa Provenza</AnimatedText>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                    marginTop: '10px',
                    padding: '10px'
                }}
                >Concepción, San Ramón</AnimatedText>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.704161440117!2d-84.4423029242062!3d10.123283989988542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa045206a4eb143%3A0x6a695d48955edff5!2sVilla%20Provenza!5e0!3m2!1ses-419!2scr!4v1708736422591!5m2!1ses-419!2scr"
                    style={{
                        width: '50%',
                        height: '50%',
                        border: '50%',
                        borderRadius: '20px',
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"></iframe>

            </section>
            <section style={{
                scrollSnapAlign: 'start',
                backgroundImage: 'url(/assets/eff9eff37e75bc1d9b472ba3a4bde300.jpg)',
                backgroundSize: 'cover',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f7e4f0'
            }}>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '5rem', '4rem'),
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                    margin: '10px'
                }}
                >Recuerda:</AnimatedText>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                    margin: '10px'
                }}>Es importante llevar ropa y calzado cómodo</AnimatedText>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                    margin: '10px'
                }}>Ya que el evento será al aire libre</AnimatedText>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#757171',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    borderRadius: '10px',
                    fontFamily: "'Dancing Script', cursive",
                    margin: '10px'
                }}>No olvides tu abrigo</AnimatedText>
            </section>
            <section style={{
                scrollSnapAlign: 'start',
                backgroundImage: 'url(/assets/linda-flor-de-margarida-de-camomila-em-fundo-de-pessego-neutro-conceito-floral-minimalista-com-espac.png)',
                backgroundSize: 'cover',
                height: '100vh',
                flexDirection: 'column',
                display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#d6f5d6'
            }}>
                <h1
                    style={{
                        paddingTop: '50px',
                        textAlign: 'center',
                        color: '#ffffff',
                        textShadow: '0 0 10px #000000',
                        fontSize: responsiveFontSize('6rem', '5rem', '4rem'),
                        borderRadius: '10px',
                        fontFamily: "'Dancing Script', cursive",
                    }}
                >Confirmas?</h1>
                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <label htmlFor="nombre" style={{fontSize: '25px', fontWeight: 'bold', fontFamily: "'Dancing Script', cursive",textShadow: '0 0 10px #000000' }}>Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleInputChange}
                           placeholder="Tu nombre"
                           style={{padding: '10px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc'}}/>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <label htmlFor="confirmados" style={{fontSize: '25px', fontWeight: 'bold' , fontFamily: "'Dancing Script', cursive",textShadow: '0 0 10px #000000'}}>Cantidad de
                        personas:</label>
                    <input type="number" id="confirmados" name="confirmados" value={confirmados}
                           onChange={handleInputChange}
                           min="1" placeholder="1"
                           style={{padding: '10px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc'}}/>
                </div>

                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <label htmlFor="codigoPais" style={{fontSize: '20px', fontWeight: 'bold', fontFamily: "'Dancing Script', cursive",textShadow: '0 0 10px #000000',}}>Código de
                                País:</label>
                            <select id="codigoPais" name="codigoPais" value={codigoPais} onChange={handleInputChange}
                                    style={{
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                    }}>
                                <option value="+506">Costa Rica (+506)</option>
                                <option value="+1">Estados Unidos (+1)</option>
                            </select>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <label htmlFor="numero" style={{fontSize: '20px', fontWeight: 'bold' , fontFamily: "'Dancing Script', cursive",textShadow: '0 0 10px #000000',}}>Número de
                                teléfono:</label>
                            <input type="text" id="numero" name="numero" value={numero} onChange={handleInputChange}
                                   placeholder="Tu número de teléfono"
                                   style={{
                                       padding: '10px',
                                       fontSize: '14px',
                                       borderRadius: '5px',
                                       border: '1px solid #ccc',
                                       flexGrow: 1
                                   }}/>
                        </div>
                    </div>


                    <button type="submit" style={{
                        padding: '10px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#c9af97',
                        border: '#000 1px solid',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Enviar
                    </button>
                    <Popup show={showPopup} onClose={() => setShowPopup(false)} />
                </form>

            </section>
            <section style={{
                scrollSnapAlign: 'start',
                height: '100vh',
                display: 'flex',
                backgroundImage: 'url(/assets/fa53756e475e2359d7b9e1f76d43acd2.jpg)',
                backgroundSize: 'cover',
                flexDirection: 'column', // Cambio clave aquí
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5'
            }}>
                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#f5f5f5',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    flexDirection: 'column', // Cambio clave aquí
                    borderRadius: '10px',
                    textShadow: '0 0 10px #000000',
            fontFamily: "'Dancing Script', cursive",
            margin: '10px',
            paddingBottom: '200px'
        }}
        >En este día tan especial, tu presencia es fundamental. Y si te animas a colaborar,
            juntos vamos a celebrar. </AnimatedText>

                <AnimatedText style={{
                    textAlign: 'center',
                    color: '#f5f5f5',
                    fontSize: responsiveFontSize('6rem', '2rem', '2rem'),
                    flexDirection: 'column', // Cambio clave aquí
                    borderRadius: '10px',
                    textShadow: '0 0 10px #000000',
                    fontFamily: "'Dancing Script', cursive",
                    margin: '10px',
                    paddingBottom: '200px'
                }}
                >Un regalito en efectivo, hará este sueño más efectivo. Pero recuerda lo más
            querido, es tenerte aquí conmigo.</AnimatedText>
    </section>
</div>
)
    ;
}
