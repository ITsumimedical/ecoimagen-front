<template>
    <div>
        <v-form ref="MotivoConsulta" lazy-validation>
            <v-col cols="12" sm="12" md="12">
                <v-alert class="text-center" dense text type="info" icon="mdi-message-question-outline" border="left">
                    <b>MOTIVO DE CONSULTA</b></v-alert>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea outlined auto-grow v-model="motivo.motivo_consulta" label="Motivo de consulta"
                            required :rules="[v => !!v || 'El campo Motivo de consulta es requerido']"></v-textarea>
                    </v-col>
                    <v-col>
                        <v-alert class="text-center" dense text type="info" icon="mdi-message-question-outline"
                            border="left">
                            <b>ENFERMEDAD ACTUAL</b></v-alert>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea outlined auto-grow v-model="motivo.enfermedad_actual" label="Enfermedad actual"
                            required :rules="[v => !!v || 'El campo Enfermedad actual es requerido']"></v-textarea>
                    </v-col>
                    <!-- <v-col cols="12" sm="12" md="12">
                        <v-textarea outlined auto-grow label="Resultados de Ayudas Diagnosticas"
                            v-model="motivo.resultado_ayuda_diagnostica"></v-textarea>
                    </v-col> -->
                    <v-col xs="12" v-if="datos.cita.especialidad.nombre === 'Oncologia'">
                        <v-textarea outlined dense label="Tratamiento Oncologico" value=""
                            v-model="motivo.tratamiento_oncologico">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="datos.cita.especialidad.nombre === 'Oncologia'">
                        <v-checkbox color="primary" v-model="motivo.cirujia_oncologica" value="1"
                            label="Cirugía oncológica">
                        </v-checkbox>
                        <v-col md3>
                            <v-text-field v-show="motivo.cirujia_oncologica" v-model="motivo.numero_cirugias"
                                label="cuantas: ">
                            </v-text-field>
                        </v-col>
                        <v-col md4>
                            <v-text-field v-show="motivo.cirujia_oncologica" v-model="motivo.inicio_cirujia"
                                label="Fecha de inicio: " type="date"></v-text-field>
                        </v-col>
                        <v-col md4>
                            <v-text-field v-show="motivo.cirujia_oncologica" v-model="motivo.fin_cirujia"
                                label="Fecha de finalizacion: " type="date"></v-text-field>
                        </v-col>
                    </v-col>
                    <v-col xs12 sm4 md4 v-if="datos.cita.especialidad.nombre === 'Oncologia'">
                        <v-checkbox value="1" color="primary" v-model="motivo.recibio_radioterapia"
                            label="Recibio radioterapia">
                        </v-checkbox>
                        <v-col md4>
                            <v-text-field v-show="motivo.recibio_radioterapia" v-model="motivo.numero_sesiones"
                                label="Número Sesiones: ">
                            </v-text-field>
                        </v-col>
                        <v-col md4>
                            <v-text-field v-show="motivo.recibio_radioterapia" v-model="motivo.inicio_radioterapia"
                                label="Fecha de inicio: " type="date"></v-text-field>
                        </v-col>
                        <v-col md4>
                            <v-text-field v-show="motivo.recibio_radioterapia" v-model="motivo.fin_radioterapia"
                                label="Fecha de finalizacion: " type="date"></v-text-field>
                        </v-col>
                    </v-col>
                    <v-col xs12 sm4 md4 v-if="datos.cita.especialidad.nombre === 'Oncologia'">
                        <v-col xs12>
                            <v-select :items="intencion" v-model="motivo.intencion"
                                label="Intencion del tratamiento oncológico inicial"></v-select>
                        </v-col>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="datos.estado_triage">
                        <v-select outlined :items="listaMotivoIngreso" v-model="motivo.motivo_ingreso"
                            label="Motivo ingreso"></v-select>
                    </v-col>
                    <v-col v-if="datos.cita.tipo_historia_id == 35" cols="12" sm="12" md="12">
                        <v-checkbox v-model="checkbox1" label="Alergia"></v-checkbox>
                    </v-col>
                    <v-col v-if="checkbox1 || resumen.alergia" cols="12" sm="12" md="12">
                        <v-textarea outlined dense label="Alergia" v-model="motivo.alergia">
                        </v-textarea>
                    </v-col>
                </v-row>
            </v-col>
        </v-form>
    </div>
</template>
<script>
import moment from "moment";
import { mapGetters } from 'vuex';

export default {
    name: "MotivoConsulta",
    props: ['datos', 'resumen'],
    data() {
        return {
            motivo: {
                motivo_consulta: '',
                enfermedad_actual: '',
                // resultado_ayuda_diagnostica: '',
                intencion: '',
                tratamiento_oncologico: '',
                cirujia_oncologica: '',
                recibio_radioterapia: '',
                numero_cirugias: '',
                inicio_cirujia: '',
                fin_cirujia: '',
                inicio_radioterapia: '',
                fin_radioterapia: '',
                numero_sesiones: '',
            },
            checkbox1: false,
            errores: {
                Motivoconsulta: '',
                Enfermedadactual: ''
            },
            intencion: ['Curación', 'Paliación'],
            listaMotivoIngreso: ['Accidente de trabajo', 'Accidente de transito', 'Accidente rabico', 'Accidente ofidico',
                'Otro tipo de accidente', 'Evento catastrofico', 'Lesion por agresion', 'Lesion autoinfligida', 'Sospecha de maltrato fisico',
                'Sospecha de abuso sexual', 'Sospecha de violencia sexual', 'Sospecha de maltrato emocional', 'Enfermedad general',
                'Enfermedad profesional', 'Otra'],
            headers: [{
                text: 'Codigos',
                align: 'left',
            },
            {
                text: 'Servicios',
                value: 'calories'
            },
            {
                text: 'Fecha',
                value: 'calories'
            },
            {
                text: 'Medico Que Ordena',
                value: 'fat'
            }
            ],
            valoraciones: [],
            rules: [
                v => !!v || 'Este campo es requerido',
            ],
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    created() {
      const datosMotivo = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/MotivoConsulta');

        if (datosMotivo) {
            this.motivo.motivo_consulta = datosMotivo.motivo_consulta;
            this.motivo.enfermedad_actual = datosMotivo.enfermedad_actual;
        }
        this.fetchValoraciones();
    },
    methods: {

        llenarConDatos(datosHorus) {
            console.log('MotivoConsulta - Recibiendo datos de HorusVoice:', datosHorus);
            
            try {
                // Mapear los datos del JSON de HorusVoice a los campos del componente
                if (datosHorus.motivo_consulta && datosHorus.motivo_consulta.trim()) {
                    this.motivo.motivo_consulta = datosHorus.motivo_consulta;
                }
                
                // Para enfermedad actual, construir una descripción completa
                let enfermedadActual = '';
                
                if (datosHorus.sintomas && datosHorus.sintomas.length > 0) {
                    enfermedadActual += `Síntomas presentados: ${datosHorus.sintomas.join(', ')}.`;
                }
                
                if (datosHorus.posibles_causas && datosHorus.posibles_causas.length > 0) {
                    if (enfermedadActual) enfermedadActual += '\n\n';
                    enfermedadActual += `Posibles causas: ${datosHorus.posibles_causas.join(', ')}.`;
                }
                
                if (datosHorus.diagnostico_presuntivo && datosHorus.diagnostico_presuntivo.trim()) {
                    if (enfermedadActual) enfermedadActual += '\n\n';
                    enfermedadActual += `Diagnóstico presuntivo: ${datosHorus.diagnostico_presuntivo}.`;
                }
                
                // Si no hay enfermedad actual específica pero hay diagnóstico
                if (!enfermedadActual && datosHorus.diagnostico_presuntivo) {
                    enfermedadActual = datosHorus.diagnostico_presuntivo;
                }
                
                if (enfermedadActual.trim()) {
                    this.motivo.enfermedad_actual = enfermedadActual;
                }
                
                // Llenar alergia si está presente en antecedentes
                if (datosHorus.antecedentes && datosHorus.antecedentes.length > 0) {
                    const alergias = datosHorus.antecedentes.filter(ant => 
                        ant.toLowerCase().includes('alergia') || 
                        ant.toLowerCase().includes('alérgico') ||
                        ant.toLowerCase().includes('alergia')
                    );
                    
                    if (alergias.length > 0) {
                        this.motivo.alergia = alergias.join(', ');
                        this.checkbox1 = true;
                    }
                }
                
                // Forzar la validación del formulario después de llenar los datos
                this.$nextTick(() => {
                    if (this.$refs.MotivoConsulta) {
                        this.$refs.MotivoConsulta.validate();
                    }
                });
                
                console.log('MotivoConsulta - Datos aplicados correctamente');
                this.$toast.success('Motivo de consulta actualizado con información de audio');
                
            } catch (error) {
                console.error('Error aplicando datos de HorusVoice a MotivoConsulta:', error);
                this.$toast.error('Error al aplicar datos de audio al motivo de consulta');
            }
        },

        obtenerDatos() {
            return { datos: this.motivo };
        },
        validarErrores() {
            return this.$refs.MotivoConsulta.validate();
            // let errores = [];
            // if(!this.motivo.motivo_consulta){
            //   errores.push('El Campo "Motivo de consulta" es requerido.')
            // }
            // // if(this.motivo.motivo_consulta.length < 11){
            // //   errores.push('El Campo "Motivo de consulta" debe tener mas de 10 caracteres')
            // // }
            // if(!this.motivo.enfermedad_actual){
            //   errores.push('El Campo "Enfermedad Actual" es requerido.')
            // }
            // // if(this.motivo.enfermedad_actual.length < 11){
            // //   errores.push('El Campo "Enfermedad Actual" debe tener mas de 10 caracteres')
            // // }
        },
        fetchValoraciones() {
            this.$axios.get('historia/valoraciones/' + this.datos.afiliado_id)
                .then(res => {
                    this.valoraciones = res.data;
                });
        },
    }
}

</script>
