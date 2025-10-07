<template>
    <v-card class="horus-voice-container" elevation="0">
        <!-- Header -->
        <v-card-title class="pa-3 pb-2">
            <div class="d-flex align-center w-100">
                <v-avatar size="28" class="mr-2">
                    <v-icon color="purple">mdi-microphone</v-icon>
                </v-avatar>
                <span class="title-text">HORUS VOICE</span>
                <v-spacer></v-spacer>
                <v-btn icon small @click="minimizar" class="minimize-btn">
                    <v-icon small>{{ minimizado ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
            </div>
        </v-card-title>

        <v-expand-transition>
            <v-card-text v-show="!minimizado" class="pa-3 pt-0">
                <!-- Estado de la grabación -->
                <div class="text-center mb-3">
                    <div class="status-indicator mb-2">
                        <v-chip :color="estadoColor" dark small class="status-chip">
                            <v-icon left small>{{ estadoIcon }}</v-icon>
                            {{ estadoTexto }}
                        </v-chip>
                    </div>

                    <!-- Tiempo de grabación -->
                    <div v-if="grabando || tiempoGrabacion > 0" class="tiempo-grabacion">
                        {{ formatearTiempo(tiempoGrabacion) }}
                    </div>
                </div>

                <!-- Visualizador de audio -->
                <div v-if="grabando" class="audio-visualizer mb-3">
                    <div class="wave-container">
                        <div v-for="i in 12" :key="i" class="wave-bar" :style="{ animationDelay: (i * 0.1) + 's' }">
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-center align-center">
                    <v-btn v-if="!grabando" fab :color="audioGrabado ? 'success' : 'primary'" class="control-btn"
                        @click="iniciarGrabacion" :disabled="!soporteAudio">
                        <v-icon large>mdi-microphone</v-icon>
                    </v-btn>

                    <v-btn v-if="grabando" fab color="error" class="control-btn pulse-animation"
                        @click="detenerGrabacion">
                        <v-icon large>mdi-stop</v-icon>
                    </v-btn>

                    <div v-if="audioGrabado && !grabando" class="ml-2">
                        <v-btn icon color="primary" @click="reproducirAudio" class="mr-1">
                            <v-icon>{{ reproduciendoAudio ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                        </v-btn>

                        <v-btn icon color="success" @click="enviarAudio" class="mr-1">
                            <v-icon>mdi-send</v-icon>
                        </v-btn>

                        <v-btn icon color="error" @click="eliminarAudio">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </div>

                <!-- Mensaje de error o información -->
                <div v-if="mensaje" class="text-center mt-2">
                    <v-alert :type="tipoMensaje" dense text class="ma-0">
                        {{ mensaje }}
                    </v-alert>
                </div>

                <!-- Elemento de audio oculto para reproducción -->
                <audio ref="audioPlayer" style="display: none;" @ended="audioTerminado"></audio>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<script>
export default {
    name: 'HorusVoiceComponente',
    data() {
        return {
            grabando: false,
            audioGrabado: null,
            mediaRecorder: null,
            stream: null,
            chunks: [],
            tiempoGrabacion: 0,
            intervalTimer: null,
            soporteAudio: false,
            minimizado: false,
            reproduciendoAudio: false,
            mensaje: '',
            tipoMensaje: 'info'
        };
    },
    computed: {
        estadoTexto() {
            if (this.grabando) return 'Grabando...';
            if (this.audioGrabado) return 'Audio listo';
            return 'Listo para grabar';
        },
        estadoColor() {
            if (this.grabando) return 'error';
            if (this.audioGrabado) return 'success';
            return 'primary';
        },
        estadoIcon() {
            if (this.grabando) return 'mdi-record-rec';
            if (this.audioGrabado) return 'mdi-check-circle';
            return 'mdi-microphone-outline';
        }
    },
    mounted() {
        this.verificarSoporteAudio();
    },
    beforeDestroy() {
        this.limpiarRecursos();
    },
    methods: {
        async verificarSoporteAudio() {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error('Tu navegador no soporta grabación de audio');
                }
                this.soporteAudio = true;
            } catch (error) {
                this.mostrarMensaje('Tu navegador no soporta grabación de audio', 'error');
                this.soporteAudio = false;
            }
        },

        async iniciarGrabacion() {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }
                });

                this.mediaRecorder = new MediaRecorder(this.stream, {
                    mimeType: 'audio/webm;codecs=opus'
                });

                this.chunks = [];
                this.tiempoGrabacion = 0;

                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.chunks.push(event.data);
                    }
                };

                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.chunks, { type: 'audio/webm;codecs=opus' });
                    this.audioGrabado = blob;
                    this.limpiarStream();
                };

                this.mediaRecorder.start();
                this.grabando = true;
                this.iniciarTimer();
                this.mostrarMensaje('Grabación iniciada', 'success');

            } catch (error) {
                console.error('Error al iniciar grabación:', error);
                this.mostrarMensaje('Error al acceder al micrófono', 'error');
            }
        },

        detenerGrabacion() {
            if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
                this.grabando = false;
                this.detenerTimer();
                this.mostrarMensaje('Grabación completada', 'success');
            }
        },

        iniciarTimer() {
            this.intervalTimer = setInterval(() => {
                this.tiempoGrabacion++;
            }, 1000);
        },

        detenerTimer() {
            if (this.intervalTimer) {
                clearInterval(this.intervalTimer);
                this.intervalTimer = null;
            }
        },

        limpiarStream() {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
        },

        limpiarRecursos() {
            this.detenerTimer();
            this.limpiarStream();
            if (this.mediaRecorder) {
                this.mediaRecorder = null;
            }
        },

        formatearTiempo(segundos) {
            const mins = Math.floor(segundos / 60);
            const secs = segundos % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },

        reproducirAudio() {
            if (!this.audioGrabado) return;

            if (this.reproduciendoAudio) {
                this.$refs.audioPlayer.pause();
                this.reproduciendoAudio = false;
            } else {
                const url = URL.createObjectURL(this.audioGrabado);
                this.$refs.audioPlayer.src = url;
                this.$refs.audioPlayer.play();
                this.reproduciendoAudio = true;
            }
        },

        eliminarAudio() {
            this.audioGrabado = null;
            this.tiempoGrabacion = 0;
            this.reproduciendoAudio = false;
            this.mostrarMensaje('Audio eliminado', 'info');
        },

        async enviarAudio() { 
            if (!this.audioGrabado) return;

            try {
                this.mostrarMensaje('Enviando audio...', 'info');

                // Crear FormData para enviar el audio
                const formData = new FormData();
                formData.append('audio', this.audioGrabado, 'grabacion.webm');

                const horusVoiceUrl = this.$config.HORUS_VOICE_API_URL;

                // Realizar la petición al microservicio HorusVoice
                const response = await this.$axios.post(`${horusVoiceUrl}/api/audio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000, // 30 segundos de timeout
                });

                if (response.status === 200) {
                    this.mostrarMensaje('Audio enviado correctamente', 'success');
                    console.log('Respuesta del microservicio:', response.data);
                    
                    // Emitir evento con la respuesta para el componente padre
                    this.$emit('audioProcessed', response.data);
                    
                    this.eliminarAudio();
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }

            } catch (error) {
                console.error('Error al enviar audio:', error);
                
                let mensajeError = 'Error al enviar audio';
                if (error.code === 'ECONNABORTED') {
                    mensajeError = 'Timeout: El servidor tardó mucho en responder';
                } else if (error.response) {
                    mensajeError = `Error del servidor: ${error.response.status}`;
                } else if (error.request) {
                    mensajeError = 'No se pudo conectar con el microservicio';
                }
                
                this.mostrarMensaje(mensajeError, 'error');
            }
        },

        minimizar() {
            this.minimizado = !this.minimizado;
        },

        mostrarMensaje(texto, tipo = 'info') {
            this.mensaje = texto;
            this.tipoMensaje = tipo;

            setTimeout(() => {
                this.mensaje = '';
            }, 3000);
        },

        audioTerminado() {
            this.reproduciendoAudio = false;
        }
    }
};
</script>

<style scoped>
.horus-voice-container {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.title-text {
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.minimize-btn {
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.minimize-btn:hover {
    opacity: 1;
}

.status-chip {
    font-size: 11px;
    height: 24px;
}

.tiempo-grabacion {
    font-family: 'Courier New', monospace;
    font-size: 18px;
    font-weight: bold;
    color: #e91e63;
}

.control-btn {
    width: 56px !important;
    height: 56px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.pulse-animation {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }
}

.audio-visualizer {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.wave-container {
    display: flex;
    align-items: center;
    gap: 2px;
}

.wave-bar {
    width: 3px;
    height: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
    animation: wave 1.2s infinite ease-in-out;
}

@keyframes wave {

    0%,
    40%,
    100% {
        transform: scaleY(1);
    }

    20% {
        transform: scaleY(2.5);
    }
}
</style>