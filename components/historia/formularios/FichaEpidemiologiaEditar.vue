<template>
    <v-dialog v-model="mostrarFormularioEpidemiologia" persistent max-width="1300px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>EDITAR FORMULARIO DEl EVENTO {{
                                diagnosticoSeleccionadoEdit?.eventoSivigila?.nombre_evento }} - ({{
                                    diagnosticoSeleccionadoEdit?.dx }})</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="camposObligatoriosForm" v-model="valid" lazy-validation>
                    <v-row dense v-for="cabeceraSivigila in cabeceraSivigilas" :key="cabeceraSivigila.id"
                        v-if="cabeceraSivigila.nombre_cabecera != 'ESPACIO EXCLUSIVO PARA USO DE LOS ENTES TERRITORIALES'">
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" color="green darken-1" type="info"
                                icon="mdi-account-details-outline" class="text-center">{{
                                cabeceraSivigila.nombre_cabecera }}</v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="4"
                            v-for="campo in cabeceraSivigila.campo_sivigila.filter(c => evaluarCondicion(c.condicion, c.comparacion))"
                            :key="campo.id">
                            <v-text-field v-if="campo.tipo_campo === 'texto'" v-model="campo.valor"
                                :label="campo.nombre_campo" outlined dense color="green darken-1"
                                :rules="campo.obligatorio == true ? campoObligatorio : []"
                                :hint="campo.nombre_campo"></v-text-field>

                            <v-text-field v-model="campo.valor" v-else-if="campo.tipo_campo === 'numero'"
                                :label="campo.nombre_campo" outlined dense color="green darken-1" type="number"
                                :rules="[...(campo.obligatorio == true ? campoObligatorio : []), ...(campo.max == true ? maxGestacion : []), ...(campo.min == true ? minGestacion : [])]"
                                :hint="campo.nombre_campo" :max="campo.max == true ? 42 : ''"
                                :min="campo.min == true ? 1 : ''">
                            </v-text-field>


                            <v-select v-else-if="campo.tipo_campo === 'seleccion_simple'" v-model="campo.valor"
                                :label="campo.nombre_campo" outlined dense color="green darken-1"
                                :items="campo.opciones_campo_sivigila.map(opcion => ({ text: opcion.nombre_opcion, value: opcion.nombre_opcion }))"
                                :rules="campo.obligatorio == true ? campoObligatorio : []" :hint="campo.nombre_campo">
                            </v-select>

                            <v-autocomplete v-else-if="campo.tipo_campo === 'seleccion_multiple'" v-model="campo.valor"
                                :label="campo.nombre_campo" outlined dense chips small-chips multiple
                                color="green darken-1"
                                :items="campo.opciones_campo_sivigila.map(opcion => ({ text: opcion.nombre_opcion, value: opcion.nombre_opcion }))"
                                :rules="campo.obligatorio == true ? campoObligatorio : []" :hint="campo.nombre_campo">
                            </v-autocomplete>

                            <v-menu v-else-if="campo.tipo_campo === 'fecha'" v-model="campo.fechaMenu"
                                :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
                                min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" :label="campo.nombre_campo" outlined dense
                                        color="green darken-1" :value="campo.valor"
                                        :rules="campo.obligatorio == true ? campoObligatorio : []" readonly clearable
                                        @click:clear="campo.valor = null">
                                    </v-text-field>
                                </template>
                                <v-date-picker v-model="campo.valor" @input="campo.fechaMenu = false" no-title
                                    scrollable :max="campo.max == true ? fechaHoy : ''"></v-date-picker>
                            </v-menu>

                            <v-menu v-else-if="campo.tipo_campo === 'hora'" v-model="campo.hora"
                                :close-on-content-click="false" :nudge-right="40" transition="scale-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" :label="campo.nombre_campo" outlined dense
                                        color="green darken-1" :value="campo.valor"
                                        :rules="campo.obligatorio == true ? campoObligatorio : []" readonly clearable
                                        @click:clear="campo.valor = null">
                                    </v-text-field>
                                </template>
                                <v-time-picker v-model="campo.valor" format="24hr" full-width
                                    @click:minute="campo.hora = false"></v-time-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="green" dark small @click="guardarRespuestas">Actualizar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {
    mapActions
} from 'vuex';
export default {
    props: {
        mostrarFormularioEpidemiologia: {
            type: Boolean,
            default: false
        },
        diagnosticoSeleccionadoEdit: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            cabeceraSivigilas: [],
            campo_sivigila: [],
            valid: true,
            campoObligatorio: [
                v => !!v || "Campo obligatorio, por favor ingrese un valor",
            ],
            maxGestacion: [
                v => v <= 42 || `El valor máximo es 42 semanas de gestación`,
            ],
            minGestacion: [
                v => v >= 1 || `El valor mínimo es 1 semana de gestación`,
            ],
            fechaHoy: this.$moment().format('YYYY-MM-DD'),
        }
    },
    watch: {
        async mostrarFormularioEpidemiologia(newValue) {
            if (newValue) {
                await this.listarCabeceraCampos();
                await this.consultarRegistroCie10Consulta();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        async listarCabeceraCampos() {
            try {
                this.setPreload(true);
                const eventoId = this.diagnosticoSeleccionadoEdit?.eventoSivigila?.id;
                const valorTipo = {
                    texto: '',
                    numero: '',
                    seleccion_simple: '',
                    seleccion_multiple: '',
                    fecha: null,
                    hora: null,
                };

                const response = await this.$axios
                    .get(`epidemiologia/listar-cabecera-campos/${eventoId}`);
                this.cabeceraSivigilas = response.data.map(cabecera => ({
                    ...cabecera,
                    campo_sivigila: cabecera.campo_sivigila.map(campo => ({
                        ...campo,
                        fechaMenu: campo.tipo_campo === 'fecha' ? false : undefined,
                        hora: campo.tipo_campo === 'hora' ? false : undefined,
                        opciones_campo_sivigila: campo.opciones_campo_sivigila || null,
                        valor: valorTipo[campo.tipo_campo] ?? undefined,
                    }))
                }));
            } catch (error) {
                this.$toast.error('Error al cargar el formulario');
            } finally {
                this.setPreload(false);
            }
        },

        async guardarRespuestas() {
            try {
                const consultaId = this.diagnosticoSeleccionadoEdit?.consultaId;
                const eventoId = this.diagnosticoSeleccionadoEdit?.eventoSivigila?.id;
                const afiliadoId = this.diagnosticoSeleccionadoEdit?.afiliadoId;
                const cie10Id = this.diagnosticoSeleccionadoEdit?.cie10Id;

                this.setPreload(true);
                const {
                    data: respuestaExistente
                } = await this.$axios.post("epidemiologia/obtener-respuestas", {
                    evento_id: eventoId,
                    afiliado_id: afiliadoId,
                    consulta_id: consultaId,
                    cie10_id: cie10Id,
                });

                if (respuestaExistente.length > 0) {
                    const respuestas = this.cabeceraSivigilas.flatMap(cabecera =>
                        cabecera.campo_sivigila.map(campo => {
                            const respuestaEncontrada = respuestaExistente.find(resp => resp.campo_id === campo.id);
                            return {
                                consulta_id: consultaId,
                                campo_id: campo.id,
                                respuesta_campo: campo.valor ?? null,
                                id: respuestaEncontrada ? respuestaEncontrada.id : null,
                            };
                        })
                    );
                    if (!this.$refs.camposObligatoriosForm.validate()) {
                        return this.$toast.error('Por favor, complete todos los campos obligatorios');
                    }
                    await this.$axios.post('epidemiologia/actualizar-respuestas', { respuestas });
                    this.$toast.success('La ficha epidemiologica fue actualizada exitosamente!!');
                    this.cerrarFormulario();
                }

            } catch (error) {
                this.$toast.error('Error al actualizar las respuestas');
            } finally {
                this.setPreload(false);
            }
        },

        cerrarFormulario() {
            this.cabeceraSivigilas = [];
            this.$emit("update:mostrarFormularioEpidemiologia", false);
        },

        async consultarRegistroCie10Consulta() {

            try {
                const consulta_id = this.diagnosticoSeleccionadoEdit?.consultaId;
                const evento_id = this.diagnosticoSeleccionadoEdit?.eventoId;
                const afiliado_id = this.diagnosticoSeleccionadoEdit?.afiliadoId;
                const cie10_id = this.diagnosticoSeleccionadoEdit?.cie10Id

                const response = await this.$axios.post("epidemiologia/obtener-respuestas", {
                    evento_id,
                    afiliado_id,
                    consulta_id,
                    cie10_id
                });

                if (response.data.length > 0) {
                    this.cabeceraSivigilas.forEach(cabecera => {
                        cabecera.campo_sivigila.forEach(campo => {
                            const respuesta = response.data.find(r => r.campo_id === campo.id);
                            if (campo.tipo_campo === 'seleccion_multiple' && respuesta && respuesta.respuesta_campo) {
                                campo.valor = respuesta.respuesta_campo.split(',');
                            } else if (respuesta) {
                                campo.valor = respuesta.respuesta_campo;
                            } else {
                                campo.valor = null;
                            }
                        });
                    });
                }
            } catch (error) {
                this.$toast.error('Error al consultar respuestas');
            }
        },

        evaluarCondicion(condicion, comparacion) {
            if (!condicion) return true;

            return this.cabeceraSivigilas.some(cabecera =>
                cabecera.campo_sivigila.some(campo =>
                    (campo.id === comparacion && campo.valor === condicion) || condicion === 'No mostar'
                )
            );
        }
    },


};
</script>
