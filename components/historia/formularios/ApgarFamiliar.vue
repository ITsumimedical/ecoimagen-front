<template>
    <div>
      <v-form ref="formApgar">
        <v-col></v-col>
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="blue-grey"
                    class="text-center">
                    <b>Apgar Familiar</b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="6" md="3" v-for="c in arrCheckBox" :key="c.id">
                <label style="font-size: 8px;">
                    <h2>{{ c.nombre }}</h2>
                </label>
                <v-radio-group dense style="font-size: 8px" v-model="apgarFamiliar[c.model]" :rules="CampoRequerido">
                    <v-radio color="red" v-for="n in c.options" :key="n.val" :label="n.nombre" :value="n.val"></v-radio>
                </v-radio-group>
                
                <!-- <v-radio-group dense style="font-size: 8px" v-model="apgarFamiliar[c.model]" :rules="CampoRequerido">
                    <v-radio color="red" v-for="n in c.options" :key="n.val" :label="n.nombre" :value="n.val"></v-radio>
                </v-radio-group> -->
            </v-col>
            <label style="font-size: 8px;">
                    <h2>{{ '*NOTA: si el resultado esta entre 17 y 20 es normal, entre 16-13 disfunción leve, entre 12 y 10 disfunción moderada y menor o igual a 9 es disfunción grave.*' }}</h2>
                </label>

            <v-col cols="12" sm="12" md="12" style="text-align: center">
                <label style="font-size: large"><b>Resultado:{{ resultadoApgar }}</b></label>
              </v-col>
              
              <v-col cols="12" sm="12" md="12">
                <v-col cols="12" sm="12" md="12">
                  <v-alert dense :type="tipoResultado" :color="colorAlerta" :icon="tipoResultado" text>
                    <b>Nota: {{ mensajeResultado }}</b>
                  </v-alert>
                </v-col>
              </v-col>
              
              <!-- <v-col xs12 sm12 md12 style="text-align: center">
                <v-btn color="success" dark small @click="saveResultado()" :loading="loading">Guardar Resultado</v-btn>
              </v-col> -->
            </v-row>
          </v-form>
          </div>
        </template>

<script>
    export default {
        props: ['datos'],
        data() {
            return {
                apgarFamiliar: {
                    ayuda_familia: '',
                    familia_habla_con_usted: '',
                    cosas_nuevas: '',
                    le_gusta_familia_hace: '',
                    le_gusta_familia_comparte: '',
                    resultado: 0
                },
                CampoRequerido: [
           v => v !== '' && v !== null && v !== undefined || 'Este campo es requerido',
         ],

                mensajeResultado: 'Resultado apgar familiar',
                colorAlerta: 'blue-grey',
                tipoResultado: 'info',
                arrCheckBox: [{
                        id: 1,
                        nombre: 'Estoy contento de pensar que puedo recurrir a mi familia en busca de ayuda cuando algo me preocupa.',
                        model: 'ayuda_familia',
                        options: [{
                            nombre: 'SIEMPRE',
                            val: 4
                        }, {
                            nombre: 'CASI SIEMPRE',
                            val: 2,
                        }, {
                            nombre: 'ALGUNAS VECES',
                            val: 1,
                        }, {
                            nombre: 'CASI NUNCA',
                            val: 0
                        }]
                    },
                    {
                        id: 2,
                        nombre: 'Estoy satisfecho con el modo que tiene mi familia de hablar las cosas conmigo y de cómo compartimos los problemas.',
                        model: 'familia_habla_con_usted',
                        options: [{
                            nombre: 'SIEMPRE',
                            val: 4
                        }, {
                            nombre: 'CASI SIEMPRE',
                            val: 2
                        }, {
                            nombre: 'ALGUNAS VECES',
                            val: 1
                        }, {
                            nombre: 'CASI NUNCA',
                            val: 0
                        }]
                    },
                    {
                        id: 3,
                        nombre: 'Me agrada pensar que mi familia acepta y apoya mis deseos de llevar a cabo nuevas actividades o seguir una nueva dirección.',
                        model: 'cosas_nuevas',
                        options: [{
                            nombre: 'SIEMPRE',
                            val: 4
                        }, {
                            nombre: 'CASI SIEMPRE',
                            val: 2
                        }, {
                            nombre: 'ALGUNAS VECES',
                            val: 1
                        }, {
                            nombre: 'CASI NUNCA',
                            val: 0
                        }]
                    },
                    {
                        id: 4,
                        nombre: 'Me satisface el modo que tiene mi familia de expresar su afecto y cómo responde a mis emociones, como cólera, tristeza y amor.',
                        model: 'le_gusta_familia_hace',
                        options: [{
                                nombre: 'SIEMPRE',
                                val: 4
                            }, {
                                nombre: 'CASI SIEMPRE',
                                val: 2
                            },
                            {
                                nombre: 'ALGUNAS VECES',
                                val: 1
                            },
                            {
                                nombre: 'CASI NUNCA',
                                val: 0
                            }
                        ]
                    },
                    {
                        id: 5,
                        nombre: 'Me satisface la forma en que mi familia y yo pasamos el tiempo juntos.',
                        model: 'le_gusta_familia_comparte',
                        options: [{
                                nombre: 'SIEMPRE',
                                val: 4
                            }, {
                                nombre: 'CASI SIEMPRE',
                                val: 2
                            },
                            {
                                nombre: 'ALGUNAS VECES',
                                val: 1
                            },
                            {
                                nombre: 'CASI NUNCA',
                                val: 0
                            }
                        ]
                    },
                    // {
                    //     id: 6,
                    //     nombre: 'NOTA: si el resultado esta entre 17 y 20 es normal, entre 16-13 disfunción leve, entre 12 y 10 disfunción moderada y menor o igual a 9 es disfunción grave.',
                    // }
                ],
            }
        },

        watch: {
            resultadoApgar(newValue) {
                if (newValue >= 17 && newValue <= 20) {
                    this.tipoResultado = "mdi-information";
                    this.mensajeResultado = "Normal";
                    this.colorAlerta = "success";
                } else if (newValue >= 13 && newValue <= 16) {
                    this.tipoResultado = "mdi-alert-rhombus";
                    this.mensajeResultado = "Disfunción leve";
                    this.colorAlerta = "warning";
                } else if (newValue >= 10 && newValue <= 12) {
                    this.tipoResultado = "mdi-alert";
                    this.mensajeResultado = "Disfunción moderada";
                    this.colorAlerta = "orange";
                } else if (newValue <= 9) {
                    this.tipoResultado = "mdi-alert-decagram";
                    this.mensajeResultado = "Disfunción grave";
                    this.colorAlerta = "error";
                }
            },
        },
        computed: {
            resultadoApgar() {
                if (this.apgarFamiliar.ayuda_familia === '' || this.apgarFamiliar.familia_habla_con_usted === '' || this
                    .apgarFamiliar.cosas_nuevas === '' ||
                    this.apgarFamiliar.le_gusta_familia_hace === '' || this.apgarFamiliar.le_gusta_familia_comparte ===
                    '') {
                    console.log(this.apgarFamiliar.ayuda_familia, '1');
                    return 0
                } else {
                    console.log(this.apgarFamiliar.ayuda_familia, '2');
                    return parseInt(this.apgarFamiliar.ayuda_familia + this.apgarFamiliar.familia_habla_con_usted +
                        this.apgarFamiliar.cosas_nuevas + this.apgarFamiliar.le_gusta_familia_hace + this
                        .apgarFamiliar
                        .le_gusta_familia_comparte)
                }

            },
        },
        mounted() {
            this.obtenerDatosApgarFamiliar()
        },

        methods: {
            obtenerDatos() {
                const data = {
                    ...this.apgarFamiliar,
                    resultado: this.resultadoApgar,
                    interpretacion_resultado: this.mensajeResultado,
                    medico_registra: this.$store.state.auth.usuario.id
                }
                return {
                    datos: data
                };
            },

            obtenerDatosApgarFamiliar() {
                this.$axios.get(`apgar-familiar/obtenerDatosApgar/${this.datos.afiliado.id}`).then(res => {
                    this.apgarFamiliar = {
                        ...this.apgarFamiliar,
                        ...res.data
                    };
                }).catch(error => {
                    console.error('Error al obtener los datos:', error);
                    this.$toast.error('Error al obtener los datos del apgar');
                });
            },
            validarErrores() {
                const campos = {
                    ...this.apgarFamiliar
                };
                delete campos.consulta_id;

                const algunCampoLleno = Object.values(campos).some(
                    valor => valor !== '' && valor !== null && valor !== undefined
                );

                // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
                if (!algunCampoLleno) {
                    return true;
                }

                // Solo si hay algún campo diligenciado, validamos todo el formulario
                return this.$refs.formApgar.validate();
            },
        }
    }

</script>
