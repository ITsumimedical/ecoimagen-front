<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                        <span>Radicación de solicitud</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
        </v-card-title>
        <v-col cols="12" sm="12" md="12">
            <v-row dense>
                <v-col cols="12" sm="6" md="4">
                    <v-autocomplete outlined label="Área" :items="areas" item-text="nombre" item-value="id"
                        v-model="form.area_id" dense required :error-messages="errors.area_id"
                        @change="fetchCategorias(form.area_id)">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-autocomplete outlined v-model="form.categoria_mesa_ayuda_id" dense :items="categorias"
                        item-text="nombre" item-value="id" :error-messages="errors.categoria_mesa_ayuda_id"
                        label="Categoría" no-data-text="Se requiere que seleccione un área">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-autocomplete outlined label="Sede de pertenencia del reportante" :items="sedes"
                        item-text="nombre" item-value="id" v-model="form.sede_id" dense required
                        :error-messages="errors.sede_id">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="8" md="8">
                    <v-text-field outlined label="Asunto" v-model="form.asunto" dense hint="¿Cual es el motivo?"
                        :error-messages="errors.asunto" required>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                    <v-text-field outlined label="Telefono de Contacto" v-model="form.contacto" type="number" dense
                        hint="Ingrese un numero de contacto" :error-messages="errors.contacto" required
                        :rules="[rules.maximo]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea label="Descripción" outlined v-model="form.descripcion" auto-grow
                        :error-messages="errors.descripcion" hint="Describa su petición detalladamente">
                    </v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-autocomplete outlined v-model="form.clasificacion" dense
                        :items="['Continuidad del negocio (temas que están deteniendo la operación, por ejemplo: la historia clínica no se está guardando, entre otros)', 'Cumplimiento de la normatividad vigente', 'Nivel contractual', 'Mejoras continuas']"
                        :error-messages="errors.clasificacion" label="Clasificación"
                        no-data-text="Se requiere que seleccione una clasificación">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-file-input v-model="adjuntos" small-chips multiple outlined dense label="Adjuntar soportes"
                        accept=".jpg, .jpeg, .png,.doc,.docx,.xml,.xlsx,.pdf">
                    </v-file-input>
                </v-col>
            </v-row>
            <v-card-actions>
                <v-col cols="6">
                    <small v-if="this.$store.state.auth.operador">{{ this.$store.state.auth.operador.nombre_completo }}
                        - </small>
                    <small v-if="this.$store.state.auth">{{ this.$store.state.auth.email }}</small>
                </v-col>
                <v-spacer></v-spacer>
                <v-btn small color="success" @click="radicarSolicitud()">Registrar solicitud</v-btn>
            </v-card-actions>
        </v-col>
    </v-card>
</template>

<script>
import { mapActions } from "vuex"
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('mesaAyuda.menu')) {
            return redirect('/');
        }
    },
    name: 'RadicarSolicitud',

    data() {
        return {
            prioridades: [],
            adjuntos: [],
            sedes: [],
            areas: [],
            categorias: [],
            form: {
                area_id: '',
                contacto: '',
                asunto: '',
                descripcion: '',
                area_th_id: '',
                categoria_mesa_ayuda_id: '',
                plataforma: 'sumimedical',
                sede_id: '',
                clasificacion: '',
            },
            errors: {
                contacto: '',
                asunto: '',
                descripcion: '',
                area_id: '',
                categoria_mesa_ayuda_id: '',
                clasificacion: '',
                sede_id: '',
            },
            rules: {
                maximo: (v) => v.length < 11 || 'Este campo solo permite 10 caracteres',
            }

        };
    },

    mounted() {
        this.listarArea();
        this.listarPrioridades();
        this.listarSedes();
    },


    methods: {
        ...mapActions('app', ['setPreload']),

        limpiarCategorias() {
            this.form.categoria_mesa_ayuda_id = ''
        },


        /**
         * Consultar todas las cetegorias activas
         * @author Kobatime
         */
        fetchCategorias(id) {
            this.setPreload(true)
            this.$axios.get(`/CategoriaMesaAyuda/listarCategoria_Area/${id}`).then(res => {
                this.categorias = res.data
            }).catch(error => {
                this.toast.error('No se encontro categorias')
            }).finally(() => {
                this.setPreload(false)
            })
        },

        /**
         * Consultar todas las areas activas
         * @author Kobatime
         */
        listarArea() {
            this.setPreload(true)
            this.$axios.post('/area-mesa-ayuda/listar', {
                estado: 1
            }).then(res => {
                let datos = []
                datos = res.data.filter((areas) => {
                    if (areas.visible == true) {
                        return areas
                    }
                })
                this.areas = datos.map((area) => {
                    return {
                        id: area.id,
                        nombre: `${area.nombre} - ${area.descripcion}`,
                    }
                })
            }).catch(error => {
                this.$toast.error(error.response.data.mensaje)
            }).finally(() => {
                this.setPreload(false)
            })
        },

        listarPrioridades() {
            this.$axios.get('/prioridades/listar-prioridades').then(res => {
                this.prioridades = res.data
            })
        },

        listarSedes() {
            this.$axios.get('/sede/listar').then(res => {
                this.sedes = res.data.data
            })
        },

        radicarSolicitud() {
            this.setPreload(true)
            this.limpiarError()
            const userId = this.$store.state.auth.usuario.id;
            const formData = new FormData();
            formData.append(`plataforma`, 'sumimedical');
            formData.append(`usuario_registra_id`, userId);
            formData.append(`asunto`, this.form.asunto);
            formData.append(`contacto`, this.form.contacto);
            formData.append(`area_id`, this.form.area_id);
            formData.append(`descripcion`, this.form.descripcion);
            formData.append(`categoria_mesa_ayuda_id`, this.form.categoria_mesa_ayuda_id);
            formData.append(`clasificacion`, this.form.clasificacion);
            formData.append(`sede_id`, this.form.sede_id);
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append(`adjuntos[]`, this.adjuntos[i]);
            }
            this.$axios.post('mesa-ayuda/crear-caso', formData)
                .then(res => {
                    const solicitudId = res.data[0]
                        .id;
                    this.$toast.success(res.data.Mensaje);
                    this.$swal({
                        title: "¡Solicitud generada con exito!",
                        text: `Es importante tener en cuenta que el responsable de la solicitud tiene la facultad de aprobar o anular la misma según su pertinencia. Además, puede ajustar la prioridad de la solicitud después de una revisión conjunta y reasignarla en caso de que haya sido escalada a un área incorrecta, lo que podría implicar un aumento en el tiempo de procesamiento`,
                        footer: '<b>Radicado de la solicitud:</b>' + solicitudId,
                        type: "success",
                    });
                    this.limpiarData();
                })
                .catch(e => {
                    this.ErrorEntrada(e.response.data);
                }).finally(() => {
                    this.setPreload(false)
                });
        },

        limpiarData() {
            for (const key in this.form) {
                this.form[key] = ''
            }
            this.adjuntos = []
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },



    },
};

</script>

<style lang="scss" scoped></style>
