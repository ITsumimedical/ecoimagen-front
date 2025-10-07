<template>
    <div>
    <div :loading="cargando">

        <v-alert text dense color="info" class="text-center" border="left" icon="mdi-progress-pencil">
            <b>TEST M-CHAT (AUTISMO)</b>
        </v-alert>
        <v-col>
            <span>
                <b>
                    Por favor responda a estas preguntas sobre su hijo/a. Tenga en cuenta cómo su hijo/a se comporta
                    habitualmente. Si usted ha visto a su hijo/a comportarse de una de estas maneras algunas veces, pero
                    no es un comportamiento habitual, por favor responda "No".
                </b>
            </span>
        </v-col>
        <v-divider></v-divider>
        <v-col></v-col>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
                <v-col v-for="pregunta in preguntas" :key="pregunta.id" cols="12" sm="6">
                    <v-alert text dense color="blue-grey" border="left"><b>{{ pregunta.texto }}</b></v-alert>
                    <v-radio-group v-model="respuestas[pregunta.campo]" row  :rules="[reglas.requerido]">
                        <v-radio label="Sí" value="Sí"></v-radio>
                        <v-radio label="No" value="No"></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <!-- <v-card-actions class="justify-center">
        <v-btn small color="success" @click="agregarRespuestas()" :loading="loading">Guardar respuestas</v-btn>
      </v-card-actions> -->
        </v-form>
        <v-alert v-if="respuestas.interpretacion_resultado" type="info" border="left" text dense class="mt-2 text-center">
            <b>{{ respuestas.interpretacion_resultado }}</b>
        </v-alert>
        <v-divider></v-divider>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex';
    export default {
        name: 'testMchat',
        props: ['datos'],
        data() {
            return {
                mostrarTest: false,
                reglas: {
                    requerido: v => !!v || 'Este campo es obligatorio',
                },
        preguntas: [{

                        id: 1,
                        texto: "Si usted señala  algo al otro lado de la habitación, ¿su hijo/a lo mira? (POR EJEMPLO, Si usted señala a un juguete, un peluche o un animal, ¿su hijo/a lo mira?)",
                        campo: "señala_mira"
                    },
                    {
                        id: 2,
                        texto: "¿Alguna vez se ha preguntado si su hijo/a es sordo/a?",
                        campo: "sordo"
                    },
                    {
                        id: 3,
                        texto: "¿Su hijo/a juega juegos de fantasía o imaginación? (POR EJEMPLO, “hace como que” bebe de una taza vacía, habla por teléfono o da de comer a una muñeca o peluche,…)",
                        campo: "juegos_fantasia"
                    },
                    {
                        id: 4,
                        texto: "¿A su hijo le gusta subirse a cosas? (POR EJEMPLO, a una silla, escaleras, o tobogán,…)",
                        campo: "se_sube_cosas"
                    },
                    {
                        id: 5,
                        texto: "¿Hace su hijo/a movimientos inusuales con sus dedos cerca de sus ojos? (POR EJEMPLO, mueve sus dedos cerca de sus ojos de manera inusual?)",
                        campo: "movimientos_inusuales_dedos"
                    },
                    {
                        id: 6,
                        texto: "¿Su hijo/a señala con un dedo cuando quiere pedir algo o pedir ayuda? (POR EJEMPLO, señala un juguete o algo de comer que está fuera de su alcance?)",
                        campo: "señala_cosas_fuera_alcance"
                    },
                    {
                        id: 7,
                        texto: "Su hijo/a señala con un dedo cuando quiere mostrarle algo que le llama la atención? (POR EJEMPLO, señala un avión en el cielo o un camión  muy grande en la calle)",
                        campo: "muestra_llama_atencion"
                    },

                    {
                        id: 8,
                        texto: "¿Su hijo/a se interesa en otros niños? (POR EJEMPLO, mira con atención a otros niños, les sonríe o se les acerca?)",
                        campo: "interesa_otros_niños"
                    },
                    {
                        id: 9,
                        texto: "¿Su hijo/a le muestra cosas acercándolas o levantándolas para que usted las vea  no para pedir ayuda sino solamente para compartirlas con usted? (POR EJEMPLO, le muestra una flor oun peluche o un coche de juguete)",
                        campo: "muestra_cosas_acercandolas"
                    },
                    {
                        id: 10,
                        texto: "¿Su hijo/a responde cuando usted le llama por su nombre?  (POR EJEMPLO, se vuelve, habla o balbucea, o deja de hacer lo que estaba haciendo para mirarle?)",
                        campo: "responde_llamado_nombre"
                    },
                    {
                        id: 11,
                        texto: "¿Cuándo usted sonríe a su hijo/a, él o ella también le sonríe?",
                        campo: "sonrie_el_tambien"
                    },
                    {
                        id: 12,
                        texto: "¿Le molestan a su hijo/a ruidos cotidianos? (POR EJEMPLO, la aspiradora o la música, incluso cuando está no está excesivamente alta?)",
                        campo: "molestan_ruidos_cotidianos"
                    },
                    {
                        id: 13,
                        texto: "¿Su hijo/a camina solo?",
                        campo: "camina_solo"
                    },
                    {
                        id: 14,
                        texto: "¿Su hijo/a le mira a los ojos cuando usted le habla, juega con él o ella, o lo viste?",
                        campo: "mira_ojos_cuando_habla"
                    },
                    {
                        id: 15,
                        texto: "¿Su hijo/a imita  sus movimientos? (POR EJEMPLO, decir adiós con la mano, aplaudir o algún ruido  gracioso que usted haga?)",
                        campo: "imita_movimientos"
                    },
                    {
                        id: 16,
                        texto: "Si usted se gira a ver algo, ¿su hijo/a trata de mirar hacia  lo que usted está mirando?",
                        campo: "gira_mirar_usted_mira"
                    },
                    {
                        id: 17,
                        texto: "¿Su hijo/a intenta que usted le mire/preste atención? (POR EJEMPLO, busca que usted le haga un cumplido, o  le dice “mira”)",
                        campo: "intenta_hagan_cumplidos"
                    },
                    {
                        id: 18,
                        texto: "¿Su hijo/a le entiende cuando usted le dice que haga algo? (POR EJEMPLO, si usted no hace gestos, ¿su hijo/a entiende “pon el libro encima de  la silla” o “tráeme la manta”?)",
                        campo: "entiende_ordenes"
                    },
                    {
                        id: 19,
                        texto: "Si algo nuevo pasa, ¿su hijo/a le mira  para ver como usted reacciona al respecto? (POR EJEMPLO, si oye un ruido extraño o ve un juguete nuevo, ¿se gira a ver su cara?)",
                        campo: "mira__reacciones"
                    },
                    {
                        id: 20,
                        texto: "Le gustan a su hijo/a los juegos  de movimiento? (POR EJEMPLO, le gusta que le balancee, o que le haga  “el caballito” sentándole en sus rodillas)",
                        campo: "gusta_juegos_movimientos"
                    },
                ],
                respuestas: {
                    señala_mira: '',
                    sordo: '',
                    juegos_fantasia: '',
                    se_sube_cosas: '',
                    movimientos_inusuales_dedos: '',
                    señala_cosas_fuera_alcance: '',
                    muestra_llama_atencion: '',
                    interesa_otros_niños: '',
                    muestra_cosas_acercandolas: '',
                    responde_llamado_nombre: '',
                    sonrie_el_tambien: '',
                    molestan_ruidos_cotidianos: '',
                    camina_solo: '',
                    mira_ojos_cuando_habla: '',
                    imita_movimientos: '',
                    gira_mirar_usted_mira: '',
                    intenta_hagan_cumplidos: '',
                    entiende_ordenes: '',
                    mira__reacciones: '',
                    gusta_juegos_movimientos: '',
                    interpretacion_resultado: '',
                },
                loading: false,
                valid: false,
                cargando: false,
                riesgoAlerta: '',
                contadorNo: 0,
            };
        },
         computed: {
            ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
        },
        mounted() {
            const datosTestMchat = this.obtenerDatosPorConsulta(this.datos.id, 'testMchat/Model/mChat', 'historia/formularios/testMchat');
            if (datosTestMchat) {
                this.respuestas = { ...datosTestMchat };
            } else {
                this.obtenerDatosAnteriores()
            }
        },
        watch: {
            respuestas: {
                handler() {
                    this.contarRespuestasNo();
                },
                deep: true,
            }
        },

        methods: {

            obtenerDatos() {
                return {
                    datos: this.respuestas
                };
            },

            obtenerDatosAnteriores() {
                this.cargando = true;
                this.$axios.get(`testMchat/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                    this.respuestas = {
                        ...this.respuestas,
                        ...res.data
                    }
                    this.contarRespuestasNo()
                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.cargando = false;
                })
            },

            contarRespuestasNo() {
                let puntaje = 0;

                const riesgoSi = ['sordo', 'movimientos_inusuales_dedos', 'molestan_ruidos_cotidianos'];

                for (const campo in this.respuestas) {
                    const respuesta = this.respuestas[campo];

                    if (riesgoSi.includes(campo)) {
                        if (respuesta === 'Sí') {
                            puntaje++;
                        }
                    } else {
                        if (respuesta === 'No') {
                            puntaje++;
                        }
                    }
                }

                this.contadorNo = puntaje;

                // Evaluar el nivel de riesgo
                if (puntaje > 0 && puntaje <= 2) {

                    this.riesgoAlerta = false;
                    this.respuestas.interpretacion_resultado =
                        'BAJO RIESGO: Repetir M-CHAT-R a los 24 meses si el niño es menor. No se requiere otra medida por ahora.';
                } else if (puntaje >= 3 && puntaje <= 7) {
                    this.riesgoAlerta = true;
                    this.respuestas.interpretacion_resultado =
                        'RIESGO MEDIO: Administrar la entrevista de seguimiento M-CHAT-R/F. Si la puntuación es ≥2, remitir para evaluación diagnóstica.';
                } else if (puntaje >= 8) {
                    this.riesgoAlerta = true;
                    this.respuestas.interpretacion_resultado =
                        'RIESGO ALTO: Remitir inmediatamente para evaluación diagnóstica e intervención temprana.';
                } else {
                    this.riesgoAlerta = false;
                    this.respuestas.interpretacion_resultado = '';
                }
            },

            validarErrores() {
            const campos = { ...this.respuestas };
            delete campos.interpretacion_resultado;

            const algunCampoLleno = Object.values(campos).some(
                valor => valor !== '' && valor !== null && valor !== undefined
            );

            // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
            if (!algunCampoLleno) {
                return true;
            }

            // Solo si hay algún campo diligenciado, validamos todo el formulario
            return this.$refs.form.validate();
        },

        }

    };

</script>
