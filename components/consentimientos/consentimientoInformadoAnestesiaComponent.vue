<template>
    <v-dialog v-model="mostrarModalConsentimiento" max-width="1200px" persistent>
        <v-card>
            <v-row class="mb-4 mr-2 ml-2 mt-2">
                <v-col cols="2">
                    <div class="d-flex align-center">
                        <img src="/images/sumi.png" alt="Logo Sumimedical" width="140px">
                    </div>
                </v-col>
                <v-divider vertical inset></v-divider>

                <v-col cols="7">
                    <h2 class="text-center">CONSENTIMIENTO INFORMADO DE ANESTESIA</h2>
                </v-col>
                <v-divider vertical inset></v-divider>

                <v-col cols="3" class="mt-2">
                    <v-row class="ml-1"><strong>Código: </strong> FO-PS-089 </v-row>
                    <v-row class="ml-1"><strong>Versión: </strong> 04</v-row>
                    <v-row class="ml-1"><strong>Fecha de aprobación: </strong> 2025-04-14</v-row>
                </v-col>
            </v-row>
            <v-divider></v-divider>

            <!-- Fecha y servicio -->
            <v-row dense class="mr-4 ml-4 mt-5">
                <v-col cols="4">
                    <v-text-field label="Fecha de diligenciamiento" v-model="form.fecha" readonly />
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Hora de diligenciamiento" v-model="form.hora" readonly />
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Servicio" v-model="form.servicio" readonly />
                </v-col>
            </v-row>
            <v-divider></v-divider>


            <!-- Datos del paciente -->
            <v-row dense class="ml-2 mr-4 mb-6">
                <v-col cols="1" class="text-center mt-6">
                    <h4>
                        <strong>Paciente</strong>
                    </h4>
                </v-col>
                <v-col cols="2">
                    <v-text-field hint="Primer apellido" persistent-hint v-model="datosUsuario.primer_apellido"
                        readonly />
                </v-col>
                <v-col cols="2">
                    <v-text-field hint="Segundo apellido" persistent-hint v-model="datosUsuario.segundo_apellido"
                        readonly />
                </v-col>
                <v-col cols="4">
                    <v-text-field hint="Nombre completo" persistent-hint v-model="nombreCompleto" readonly />
                </v-col>
                <v-col cols="2">
                    <v-text-field hint="Documento" persistent-hint v-model="datosUsuario.numero_documento" readonly />
                </v-col>
                <v-col cols="1">
                    <v-text-field hint="Edad" persistent-hint v-model="datosUsuario.edad_cumplida" readonly />
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- Descripción del procedimiento -->
            <v-row dense class="ml-8 mr-8 mt-5">
                <v-col cols="12">
                    <h3>DESCRIPCIÓN DEL PROCEDIMIENTO</h3>
                </v-col>
                <v-col cols="12">
                    <p>La anestesia es el uso de medicamentos para prevenir el dolor durante una cirugía y otros procedimientos. Estos medicamentos se denominan anestésicos. Puede ser general, regional o local. 
                        La anestesia general se administra mediante inyección intravenosa o por inhalación de anestésicos. Siempre es necesario asegurar la vía aérea y mantener una oxigenación adecuada, a través de la aplicación de un tubo en la tráquea o el uso máscaras laríngea o facial, según el caso. Mientras que, la anestesia regional, consiste en el bloqueo de la sensibilidad y motricidad de una región anatómica del cuerpo o una parte determinada en el caso de la anestesia local por la inyección de anestésicos cerca de los nervios correspondientes. Puede ser central (como peridural y raquídea) donde se bloquean los nervios en la medula espinal o periférica cuando se bloquean los nervios específicos de las extremidades.</p>
                </v-col>
            </v-row>


            <!-- Riesgos del procedimiento -->
            <v-row dense class="ml-8 mr-8 mt-5">
                <v-col cols="12">
                    <h3>RIESGOS DEL PROCEDIMIENTO</h3>
                </v-col>
                <v-col cols="12">
                    <p>Puede generar alergia a los medicamentos anestésicos, daño en la vena durante la aplicación de la anestesia general que puede necrosar (gangrena) y perder el tejido donde está dicha vena, requiriendo manejo quirúrgico para su tratamiento, fiebre alta que puede llegar a ser de difícil manejo, dolor de garganta, ronquera, daño dental, lesión de cuerda vocal, arritmias (latidos anormales del corazón), infarto cardiaco, paro cardiorespiratorio, daño cerebral, náuseas, vomito, disminución de la presión arterial, lesión de nervios en las extremidades, úlceras en la córnea, trastornos del sueño, recuerdos intraoperatorios, broncoaspiración (que se llenen los pulmones de alimentos y secreciones), laringoespasmo (cierre de la vía aérea), edema pulmonar (agua en los pulmones) e incluso, la muerte. En el caso de la anestesia, raquídea o epidural (con carácter o sin carácter) puedo presentar dolor de espalda crónico, dolor de cabeza que puede requerir una nueva inyección para colocar un parche con sangre, lesión en la columna, hematoma en la médula (coágulo de sangre que comprime la médula) y que puede requerir manejo quirúrgico para evitar secuelas neurológicas en las piernas, infección en la columna o incluso la muerte, también puede ocasionar pérdida o malformación del producto del embarazo. La aplicación de un tipo de anestesia no descarta que sea necesario cambiar la técnica inicial de acuerdo a las circunstancias. A pesar de no tener alteraciones anatómicas detectadas en el examen físico, se pueden presentar problemas en el manejo de la vía aérea. Se puede llegar a necesitar equipos médicos especiales de monitoreo para su utilización requiere de invadir el cuerpo con agujas, catéteres, guías metálicas, que pueden producir daños como lesiones pulmonares, vasculares, arritmias, perforación cardiaca, isquemia (falta de sangre) de los dedos que requiera incluso de amputación, es importante saber que incluso con una mínima dosis de anestésico, se puede ocasionar la muerte por una reacción alérgica.
En todos los casos, Sumimedical S.A.S. hace todos los esfuerzos para la reducción de los riesgos propios del procedimiento y dispone de los medios para el manejo de las complicaciones que lleguen a presentarse.</p>
                </v-col>
            </v-row>

            <!-- Alternativas disponibles -->
            <v-row dense class="ml-8 mr-8 mt-5">
                <v-col cols="12">
                    <h3>ALTERNATIVAS DISPONIBLES AL PROCEDIMIENTO</h3>
                </v-col>
                <v-col cols="12">
                    <p>No se contemplan alternativas a la aplicación de la anestesia.</p>
                </v-col>
            </v-row>

            <!-- Riesgo de no aceptar el procedimiento -->
            <v-row dense class="ml-8 mr-8 mt-5">
                <v-col cols="12">
                    <h3>RIESGO DE NO ACEPTAR EL PROCEDIMIENTO</h3>
                </v-col>
                <v-col cols="12">
                    <p>En caso de negarse a la administración de la anestesia, lo más probable es que no pueda ser intervenido quirúrgicamente.</p>
                </v-col>
            </v-row>

            <!-- Que hacer si necesita mas informacion -->
            <v-row dense class="ml-8 mr-8 mt-5">
                <v-col cols="12">
                    <h3>¿QUÉ HACER SI SE NECESITA MÁS INFORMACIÓN?</h3>
                </v-col>
                <v-col cols="12">
                    <p>En caso de requerir más información se puede contactar con el médico tratante.</p>
                </v-col>
            </v-row>

            <!-- Recomendaciones -->
            <v-row dense class="ml-8 mr-8 mt-5">
                <v-col cols="12">
                    <h3>RECOMENDACIONES</h3>
                </v-col>
                <v-col cols="12">
                    <p>Es necesario que informe al personal médico cualquier alteración propia de su salud, la existencia de comorbilidades, tales como hipertensión, diabetes, alergias, entre otros; esto ayudará a conocer mejor sus condiciones de salud. 
                        El paciente debe advertir de las posibles alergias medicamentosas, alteraciones de la coagulación, enfermedades cardiopulmonares, existencia de prótesis marca pasos, medicaciones que esté recibiendo o cualquier otra circunstancia que afecte a su salud. 
La mujer en edad reproductiva debe informar si se encuentra o no en estado de embarazo.</p>
                </v-col>
            </v-row>

            <!-- Implicaciones del acto asistencial -->
            <v-row dense class="ml-8 mr-8 mt-5">
                <v-col cols="12">
                    <h3>IMPLICACIONES DEL ACTO ASISTENCIAL</h3>
                </v-col>
                <v-col cols="12">
                    <p>Entiendo que el acto asistencial incluye el proceso diagnóstico, la propuesta terapéutica y la
                        ejecución de la intervención bajo principios éticos, técnicos y científicos, que, de acuerdo con
                        los
                        riesgos, beneficios e implicaciones mencionados arriba, se requiere de cuidados posteriores y
                        seguimiento clínico para lograr los resultados esperados. Acepto que el procedimiento busca el
                        mayor
                        beneficio para mi salud y comprendo que los resultados pueden variar según las condiciones
                        individuales.</p>
                </v-col>
            </v-row>

            <!-- Declaracion de consentimiento -->
            <v-form ref="form">
                <v-row dense class="ml-8 mr-8 mt-5">
                    <v-col cols="12">
                        <h3>DECLARACIÓN DE CONSENTIMIENTO INFORMADO</h3>
                        <v-select :items="['Paciente', 'Representante Legal']"
                            label="¿Firma el Paciente o el Representante legal?" v-model="criterios.firmante"
                            :rules="rules.firmante"></v-select>
                        <p v-if="criterios.firmante === 'Representante Legal' || datosUsuario.edad_cumplida < 18">En
                            caso de
                            realización de procedimiento en menor de edad o persona en condición de discapacidad,
                            nombre del representante legal</p>
                        <v-text-field
                            v-if="criterios.firmante === 'Representante Legal' || datosUsuario.edad_cumplida < 18"
                            label="Escriba el nombre del representante legal" v-model="criterios.nombre_representante"
                            :rules="rules.nombre_representante"></v-text-field>

                        <p > <b>a)</b> Declaro que he entendido las
                            condiciones y objetivos de la cirugía que se me va a practicar, los cuidados que debo tener
                            antes y después de ella, manifiesto que la información recibida del médico tratante ha sido
                            en un lenguaje claro y sencillo, y me ha dado la oportunidad de preguntar y resolver las
                            dudas a satisfacción, comprendo que, si es necesario extraer algún tejido, se someterá a
                            estudio anatomopatológico siendo mi deber reclamar el resultado e informarlo al médico;
                            comprendo y acepto el alcance y los riesgos que conlleva el procedimiento quirúrgico que me
                            indican, por lo que manifiesto sentirme satisfecho(a) con la información recibida:</p>
                        <v-autocomplete :items="opciones" label="Seleccione la respuesta"
                            v-model="criterios.declaracion_a" :rules="rules.declaracion"></v-autocomplete>

                        <p> <b>b)</b> El profesional me ha planteado la
                            posibilidad de participar en estudios investigativos que adelanta la institución con fines
                            de mejoramiento continuo, me ha explicado que en caso de que sea sujeto de investigación mis
                            datos serán empleados guardando estricta confidencialidad, asimismo existe posibilidad de
                            que se tomen registros fotográficos y/o audiovisuales en el proceso con fines exclusivamente
                            académicos, por lo que manifiesto sentirme satisfecho(a) con la información recibida y
                            aceptarlo : </p>
                        <v-autocomplete :items="opciones"
                            label="Seleccione la respuesta" v-model="criterios.declaracion_b"
                            :rules="rules.declaracion"></v-autocomplete>

                        <p> <b>c)</b> Por lo anteriormente dicho, y en pleno uso de mis facultades, autorizo al equipo de salud
                            de
                            la
                            Sumimedical S.A.S. para que se me realice el procedimiento arriba descrito (o a mi
                            representado
                            según el caso) el cual fue solicitado por mi médico tratante. Entiendo y asumo los riesgos
                            relacionados con la realización de este y autorizo a que se tomen las medidas necesarias
                            ante
                            cualquier complicación derivada del procedimiento:
                        </p>
                        <v-autocomplete :items="opciones" label="Seleccione la respuesta"
                            v-model="criterios.aceptacion_consentimiento" :rules="rules.aceptacion"></v-autocomplete>
                        <span><b>Nota:</b> como paciente, usted tiene derecho a retractarse de este consentimiento
                            informado en cualquier momento antes o durante la realización de la intervención.</span>
                    </v-col>
                </v-row>
                <!-- Firma consentimiento -->
                <v-row dense class="ml-8 mr-8 mt-5" v-if="criterios.aceptacion_consentimiento === 'Si'">
                    <h3>FIRMAR CONSENTIMIENTO</h3>
                    <v-col cols="12" sm="12" md="12"
                        v-if="datosUsuario.edad_cumplida >= 14 && criterios.firmante === 'Paciente'">
                        <div class="firma mb-5">
                            <h3 class="ml-3">Firma del paciente</h3>
                            <vueSignature width="100%" height="200px" ref="firmaPacienteConsentimiento" />
                            <v-btn text @click="limpiar('firmaPacienteConsentimiento')">Limpiar</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12"
                        v-if="criterios.firmante === 'Representante Legal' || datosUsuario.edad_cumplida < 18">
                        <div class="firma mb-5">
                            <h3 class="ml-3">Firma del representante legal</h3>
                            <vueSignature width="100%" height="200px" ref="firmaRepresentanteConsentimiento" />
                            <v-btn text @click="limpiar('firmaRepresentanteConsentimiento')">Limpiar</v-btn>
                        </div>
                        <div class="ml-4">
                            <v-text-field v-model="criterios.numero_documento_representante"
                                label="Identificación representante legal"
                                :rules="rules.numero_documento_representante"></v-text-field>
                        </div>
                    </v-col>
                </v-row>

                <!-- Firma discentimiento -->
                <v-row dense class="ml-8 mr-8 mt-5" v-if="criterios.aceptacion_consentimiento === 'No'">
                    <v-col cols="12">
                        <h3>DISENTIMIENTO O DESISTIMIENTO INFORMADO</h3>
                        <p>En el presente documento manifiesto que he sido informado sobre mi condición, las eventuales
                            complicaciones y/o riesgos que se deriven, los beneficios de los procedimientos planeados,
                            de
                            manera que se puedan tomar decisiones informadas; no obstante, reunido con el auxiliar de
                            laboratorio <v-text-field v-model="criterios.nombre_profesional"></v-text-field> decido de
                            forma
                            libre y consciente no aceptar/revocar la realización del procedimiento propuesto, haciéndome
                            responsable de las consecuencias que puedan derivarse de esta decisión.</p>
                    </v-col>
                    <h3>FIRMAR DISENTIMIENTO</h3>
                    <v-col cols="12" sm="12" md="12"
                        v-if="datosUsuario.edad_cumplida >= 14 && criterios.firmante === 'Paciente'">
                        <div class="firma mb-5">
                            <h3 class="ml-3">Firma disentimiento del paciente</h3>
                            <vueSignature width="100%" height="200px" ref="firmaPacienteDisentimiento" />
                            <v-btn text @click="limpiar('firmaPacienteDisentimiento')">Limpiar</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12"
                        v-if="criterios.firmante === 'Representante Legal' || datosUsuario.edad_cumplida < 18">
                        <div class="firma mb-5">
                            <h3 class="ml-3">Firma disentimiento del representante legal</h3>
                            <vueSignature width="100%" height="200px" ref="firmaRepresentanteDisentimiento" />
                            <v-btn text @click="limpiar('firmaRepresentanteDisentimiento')">Limpiar</v-btn>
                        </div>
                        <div class="ml-4">
                            <v-text-field v-model="criterios.numero_documento_representante"
                                :rules="rules.numero_documento_representante"
                                label="Identificación representante legal"></v-text-field>
                        </div>
                    </v-col>
                </v-row>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn color="red" dark medium @click="cerrarModal()">Cerrar</v-btn> -->
                    <v-btn color="green" dark medium @click="guardarFirma()">Guardar</v-btn>
                </v-card-actions>

            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import vueSignature from "vue-signature";
import { mapActions } from "vuex";
import moment from "moment";
moment.locale("es");

export default {
    components: {
        vueSignature

    },
    props: {
        datosUsuario: {
            type: Object,
        },
        consultaId: {
            type: Number
        }

    },
    computed: {
        nombreCompleto() {
            return `${this.datosUsuario.primer_nombre} ${this.datosUsuario.segundo_nombre}`
        }
    },

    data() {
        return {
            firmarDisentimiento: false,
            form: {
                fecha: moment().format('DD/MM/YYYY'),
                hora: moment().format('HH:mm a'),
                servicio: 'Anestesiología'
            },
            consentimiento: '',
            consentimientos: {
                alernativas: '',
                beneficios: '',
                codigo: '',
                version: '',
                fecha_aprobacion: '',
                recomendaciones: '',
                informacion: '',
                riesgo_no_aceptar: '',
                riesgos: '',
                beneficios: '',
                descripcion: '',
                nombre: ''

            },
            criterios: {
                id: [],
                firma_paciente: null,
                firmante: this.datosUsuario.edad_cumplida < 14 ? 'Representante Legal' : '',
                numero_documento_representante: null,
                declaracion_a: 'Si',
                declaracion_b: 'Si',
                declaracion_c: 'Si',
                nombre_profesional: `${this.$store.state.auth.usuario.operador.nombre} ${this.$store.state.auth.usuario.operador.apellido}`,
                nombre_representante: null,
                firma_disentimiento: null,
                aceptacion_consentimiento: 'Si',
                firma_representante: null
            },
            rules: {
                firmante: [(v) => !!v || "El firmante es requerido"],
                declaracion: [(v) => !!v || "La declaracion es requerida"],
                aceptacion: [(v) => !!v || "La autorización es requerida"],
                nombre_representante: [v => !(this.criterios.firmante == 'Representante Legal' || this.datosUsuario.edad_cumplida < 18) || !!v || 'El nombre del representante es obligatorio'],
                numero_documento_representante: [v => !(this.criterios.firmante == 'Representante Legal' || this.datosUsuario.edad_cumplida < 18) || !!v || 'El documento del representante es obligatorio']
            },
            opciones:[
                {text: 'SI', value: 'Si'},
                {text: 'NO', value: 'No'},

            ],
            existe:false,
            mostrarModalConsentimiento: false,
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        guardarFirma() {
            if (!this.$refs.form.validate()) {
                this.$toast.error('Por favor diligencia todos los campos obligatorios')
                return
            }

            //obtenemos las firmas de los usuarios
            this.criterios.firma_paciente = this.obtenerFirma('firmaPacienteConsentimiento')
            this.criterios.firma_representante = this.obtenerFirma('firmaRepresentanteConsentimiento')

            this.criterios.firma_disentimiento = this.obtenerFirma('firmaPacienteDisentimiento')
            this.criterios.firma_representante = this.criterios.firma_representante ?? this.obtenerFirma('firmaRepresentanteDisentimiento')

            if (!this.criterios.firma_paciente && !this.criterios.firma_representante && !this.criterios.firma_disentimiento) {
                this.$swal({
                    title: "¡Error!",
                    text: "Debe tener al menos una firma del usuario",
                    type: "warning",
                });
                return
            }
            
            //logica para almacenar la consulta
            const data = {
                consulta_id: this.consultaId,
                firma_consentimiento: this.criterios.firma_paciente,
                firmante: this.criterios.firmante,
                numero_documento_representante: this.criterios.numero_documento_representante,
                declaracion_a: this.criterios.declaracion_a,
                declaracion_b: this.criterios.declaracion_b,
                aceptacion_consentimiento: this.criterios.aceptacion_consentimiento,
                nombre_profesional: this.criterios.nombre_profesional,
                nombre_acompanante: this.criterios.nombre_representante,
                firma_disentimiento: this.criterios.firma_disentimiento,
                firma_acompanante: this.criterios.firma_representante
            }

            this.setPreload(true)
            this.$axios.post('consultas/firmar-consentimiento-anestesia', data)
                .then((res) => {
                    this.$toast.success(res.data.mensaje)
                    this.cerrarModal()
                }).catch((error) => {
                    console.log(error)
                    this.$toast.error('Se generó un error durante la firma del consentimiento')
                }).finally(() => {
                    this.setPreload(false)
                })

        },
        limpiar(refNombre) {
            this.$refs[refNombre].clear();
        },
        cerrarModal() {
            this.mostrarModalConsentimiento = false;
            this.$emit('update:firmado', true);

        },
        abrirModal(){
            this.mostrarModalConsentimiento = true;
        },
        obtenerFirma(key) {
            const ref = this.$refs[key]
            if (ref && !ref.isEmpty()) {
                return ref.save()
            } else {
                return null
            }


        }

    },

}
</script>
