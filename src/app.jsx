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



export function App() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
                backgroundImage: 'url("src/assets/a9e4732d4bbc228fc2abc2206f84f5cb.png")',
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
                backgroundImage: 'url("src/assets/marco-flor-margarita-sobre-fondo-verde-claro_53876-101005.png")',
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
                    Samy Alpizar
                </AnimatedText>
            </section>
            <section style={{
                scrollSnapAlign: 'start',
                backgroundImage: 'url(src/assets/pngtree-beige-daisy-flower-page-border-image_13368886.jpg)',
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
                backgroundImage: 'url(src/assets/floral-daisy-flower-page-border-vector.jpg)',
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
                        boxShadow: '0 0 10px 5px #f7f0e4'
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"></iframe>

            </section>
            <section style={{
                scrollSnapAlign: 'start',
                backgroundImage: 'url(src/assets/eff9eff37e75bc1d9b472ba3a4bde300.jpg)',
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
                backgroundImage: 'url(src/assets/linda-flor-de-margarida-de-camomila-em-fundo-de-pessego-neutro-conceito-floral-minimalista-com-espac.png)',
                backgroundSize: 'cover',
                height: '100vh',
                flexDirection: 'column', // Cambio clave aquí
                display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#d6f5d6'
            }}>
                <h1
                    style={{
                        textAlign: 'center',
                        color: '#ffffff',
                        fontSize: responsiveFontSize('6rem', '5rem', '4rem'),
                        borderRadius: '10px',
                        fontFamily: "'Dancing Script', cursive",
                        margin: '10px'
                    }}
                >Confirmas?</h1>
                <form>
                    <div style={{marginBottom:'30px'}}>
                        <label htmlFor="name" style={{marginRight: '10px'}}>Nombre:</label>
                        <input type="text" id="name" name="name" placeholder="Tu nombre"/>
                    </div>
                    <div style={{margin: '10px 0'}}>
                        <label htmlFor="people" style={{marginRight: '10px'}}>Cantidad de personas:</label>
                        <input type="number" id="people" name="people" min="1" placeholder="1"/>
                    </div>
                    <button type="submit" style={{marginTop: '20px'}}>Enviar</button>
                </form>
            </section>
            <section style={{
                scrollSnapAlign: 'start',
                height: '100vh',
                display: 'flex',
                backgroundImage: 'url(src/assets/fa53756e475e2359d7b9e1f76d43acd2.jpg)',
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
                    juntos vamos a celebrar. Un regalito en efectivo, hará este sueño más efectivo. Pero recuerda lo más
                    querido, es tenerte aquí conmigo.</AnimatedText>
            </section>
        </div>
    );
}