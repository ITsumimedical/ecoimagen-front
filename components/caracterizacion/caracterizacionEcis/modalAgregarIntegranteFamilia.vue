<template>
    <v-dialog v-model="mostrarModalAgregarIntegrante" persistent fullscreen scrollable>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Agregar Integrante de la Familia</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formAgregarIntegrante">
                    <v-row dense class="my-2">
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Primer Nombre *" v-model="formIntegrante.primer_nombre"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Segundo Nombre"
                                v-model="formIntegrante.segundo_nombre" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Primer Apellido *"
                                v-model="formIntegrante.primer_apellido" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Segundo Apellido"
                                v-model="formIntegrante.segundo_apellido" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-autocomplete dense outlined label="Tipo de Identificación *"
                                :items="tipo_documento.opciones" :loading="tipo_documento.loading" item-text="nombre"
                                item-value="id" v-model="formIntegrante.tipo_documento_id"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-text-field dense outlined label="Número de Identificación *"
                                v-model="formIntegrante.numero_documento" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-menu dense v-model="fecha_nacimiento.menu" :close-on-content-click="false"
                                :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="formIntegrante.fecha_nacimiento"
                                        label="Fecha de Nacimiento *" :rules="[rules.obligatorio]" prepend-icon=""
                                        append-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on"
                                        outlined></v-text-field>
                                </template>
                                <v-date-picker v-model="formIntegrante.fecha_nacimiento"
                                    @input="fecha_nacimiento.menu = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-select dense outlined label="Sexo *" :items="sexo.opciones" :rules="[rules.obligatorio]"
                                v-model="formIntegrante.sexo" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-select dense outlined label="Rol dentro de la familia *" :items="rol_familia.opciones"
                                :rules="[rules.obligatorio]" v-model="formIntegrante.rol_familia" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-text-field dense outlined label="¿Cuál?" v-model="formIntegrante.rol_familia_otro"
                                :disabled="formIntegrante.rol_familia !== 'Otro'" :rules="[validarRolFamiliaOtro]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense outlined auto-grow label="Ocupación *" v-model="formIntegrante.ocupacion"
                                :rules="[rules.obligatorio, rules.minCaracteres]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-autocomplete dense outlined label="Nivel Educativo *" :rules="[rules.obligatorio]"
                                :items="nivel_educativo.opciones" v-model="formIntegrante.nivel_educativo" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-autocomplete dense outlined label="Régimen de afiliación *" :rules="[rules.obligatorio]"
                                :loading="tipo_afiliacion.loading" item-text="nombre" item-value="id"
                                :items="tipo_afiliacion.opciones" v-model="formIntegrante.tipo_afiliacion_id" />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-autocomplete dense outlined label="EAPB *" :items="entidad.opciones" item-text="nombre"
                                item-value="id" :rules="[rules.obligatorio]" v-model="formIntegrante.entidad_id" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete dense outlined
                                label="Pertentencia a un grupo poblacional especial protección *"
                                :items="grupo_especial_proteccion.opciones" :rules="[rules.obligatorio]"
                                v-model="formIntegrante.grupo_especial_proteccion" />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-autocomplete dense outlined label="Pertenencia Étnica *"
                                :items="pertenencia_etnica.opciones" :rules="[rules.obligatorio]"
                                v-model="formIntegrante.pertenencia_etnica" />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field dense outlined label="Comunidad o pueblo indígena"
                                v-model="formIntegrante.comunidad_pueblo_indigena" />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-autocomplete dense outlined label="Reconoce alguna discapacidad *"
                                :items="discapacidad.opciones" v-model="formIntegrante.discapacidad"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-select dense outlined
                                label="El integrante de la familia presenta situaciones o condiciones de salud crónicas *"
                                :items="opcionesSiNo" v-model="formIntegrante.condiciones_salud_cronica"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn small dark color="error" @click="cerrarModal">
                    Salir
                </v-btn>
                <v-btn small dark color="success" @click="enviarFormulario">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        caracterizacion: {
            type: Object,
            default: null
        },
        rules: {
            type: Object,
            default: null
        },
        mostrarModalAgregarIntegrante: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formIntegrante: {
                primer_nombre: '',
                segundo_nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                tipo_documento_id: null,
                numero_documento: null,
                fecha_nacimiento: null,
                sexo: null,
                rol_familia: null,
                rol_familia_otro: '',
                ocupacion: '',
                nivel_educativo: null,
                tipo_afiliacion_id: null,
                entidad_id: null,
                grupo_especial_proteccion: null,
                pertenencia_etnica: '',
                comunidad_pueblo_indigena: null,
                discapacidad: null,
                condiciones_salud_cronica: null
            },
            tipo_documento: {
                loading: false,
                opciones: []
            },
            tipo_afiliacion: {
                loading: false,
                opciones: []
            },
            fecha_nacimiento: {
                menu: false
            },
            sexo: {
                opciones: ['Hombre', 'Mujer', 'Indeterminado']
            },
            rol_familia: {
                opciones: ['Jefe(a) de familia', 'Cónyugue o compañero(a)', 'Hijo(a)', 'Hermano(a)', 'Padre o Madre', 'Otro']
            },
            nivel_educativo: {
                opciones: ['Analfabeta', 'Inicial', 'Preescolar', 'Primaria', 'Bachiller', 'Tecnólogo/Técnico', 'Universitario', 'Posgrado (Especialización, Maestría, Doctorado y PHD)']
            },
            grupo_especial_proteccion: {
                opciones: [
                    'Niñas, niños y adolescentes', 'Gestantes', 'Personas adulta mayor', 'Persona con condición de discapacidad', 'Personas con orientación', 'Personas con orientación sexual diversa',
                    'Víctimas de violencia', 'Ninguna'
                ]
            },
            pertenencia_etnica: {
                opciones: [
                    'Indígena', 'ROM (Gitano)', 'Raizal', 'Palenquero', 'Negro, Mulato, Afro', 'Otra', 'Ninguna'
                ]
            },
            discapacidad: {
                opciones: [
                    'Física', 'Auditiva', 'Visual', 'Sordoceguera', 'Intelectual', 'Psicosocial (mental)', 'Múltiple', 'Otra', 'Ninguna'
                ]
            },
            opcionesSiNo: [
                { text: 'SI', value: true },
                { text: 'NO', value: false }
            ],
            entidad: {
                loading: false,
                opciones: []
            }
        }
    },
    watch: {
        mostrarModalAgregarIntegrante(nuevoValor) {
            if (nuevoValor) {
                this.listarTiposDocumento();
                this.listarTiposAfiliacion();
                this.listarEntidades();
            }
        },
        'formIntegrante.rol_familia': {
            handler(nuevoValor) {
                if (nuevoValor !== 'Otro') {
                    this.formIntegrante.rol_familia_otro = '';
                }
            },
            immediate: true
        },
    },
    computed: {
        validarRolFamiliaOtro() {
            return this.campoCondicional({
                valorControlador: this.formIntegrante.rol_familia,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 3,
                mensaje: 'Debe ingresar un rol dentro de la familia si seleccionó "Otro". Mínimo 3 caracteres.'
            })
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.$emit('update:mostrarModalAgregarIntegrante', false);
            this.$refs.formAgregarIntegrante.reset();
        },

        campoCondicional({ valorControlador, opcionesValidas, reglaBase, mensaje }) {
            return v => {
                if (!opcionesValidas.includes(valorControlador)) return true;
                if (typeof reglaBase === 'function') {
                    return reglaBase(v) || mensaje;
                }
                return v !== null && v !== undefined && v !== '' || mensaje;
            };
        },

        async listarTiposDocumento() {
            try {
                this.tipo_documento.loading = true;

                const { data } = await this.$axios.get('tipo-documento/listar');
                this.tipo_documento.opciones = data;
            } catch (error) {
                this.$toast.error('Error al listar los tipos de documento');
            } finally {
                this.tipo_documento.loading = false;
            }
        },

        async listarTiposAfiliacion() {
            try {
                this.tipo_afiliacion.loading = true;

                const { data: { data: tiposAfiliacion } } = await this.$axios.get('/tipo-afiliacion');
                this.tipo_afiliacion.opciones = tiposAfiliacion;

            } catch (error) {
                this.$toast.error('Error al listar los tipos de afiliación');
            } finally {
                this.tipo_afiliacion.loading = false;
            }
        },

        async listarEntidades() {
            try {
                this.entidad.loading = true;

                const { data } = await this.$axios.get('/entidad/listar');

                this.entidad.opciones = data;
            } catch (error) {
                this.$toast.error('Error al listar las entidades');
            } finally {
                this.entidad.loading = false;
            }
        },

        async enviarFormulario() {
            if (!this.$refs.formAgregarIntegrante.validate()) return;

            this.setPreload(true);
            try {

                const payload = {
                    afiliado_id: this.caracterizacion.afiliado_id,
                    ...this.formIntegrante,
                }

                await this.$axios.post('/caracterizacion/agregar-integrante-caracterizacion-ecis', payload);

                this.$toast.success('Integrante agregado correctamente');
                this.$emit('integranteAgregado');
                this.setPreload(false);

                this.cerrarModal();
            } catch (error) {
                this.setPreload(false);
                const msg = error?.response?.data || '';

                if (msg === 'YA_EXISTE_PARA_AFILIADO') {
                    await this.$swal({
                        type: 'warning',
                        title: 'Error',
                        text: 'Ya existe un integrante con el mismo documento asociado a este afiliado',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar'
                    });
                } else if (msg === 'YA_EXISTE_EN_OTRO_AFILIADO') {
                    const { value } = await this.$swal({
                        title: 'Ya existe un integrante con el mismo documento asociado a otro afiliado',
                        text: 'Esta persona ya fue registrada en otra caracterización. ¿Desea asociarla también a este afiliado?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        cancelButtonColor: '#d33'
                    });

                    if (value) {
                        await this.asociarIntegranteExistente();
                    }
                } else {
                    this.$toast.error('Error al agregar el integrante');
                }
            }
        },

        async asociarIntegranteExistente() {
            this.setPreload(true);
            try {
                const payload = {
                    afiliado_id: this.caracterizacion.afiliado_id,
                    tipo_documento_id: this.formIntegrante.tipo_documento_id,
                    numero_documento: this.formIntegrante.numero_documento
                };

                await this.$axios.post('/caracterizacion/asociar-integrante-existente', payload);

                this.$toast.success('Integrante asociado correctamente');
                this.$emit('integranteAgregado');
                this.cerrarModal();
            } catch (error) {
                this.$toast.error('Error al asociar el integrante.');
                console.error(error);
            } finally {
                this.setPreload(false);
            }
        }

    }
}
</script>