<template>
    <v-card flat>
        <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
                <img src="/images/ojo.svg" alt="Logo" height="50" width="50" />
                <span class="ml-3 text-h6 font-weight-bold">Registro de Novedades</span>
            </div>

            <v-btn icon @click="$emit('cerrar')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>

        <v-card-text>
            <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="9">
                            <v-autocomplete outlined dense :items="tiposNovedades"
                                v-model="novedad.tipo_novedad_afiliados_id" item-text="nombre" item-value="id"
                                :rules="[campoRequerido]" :error-messages="errors.tipo_novedad_afiliados_id"
                                no-data-text="No se han encontrado tipos de novedad" label="Tipo de novedad" />
                        </v-col>
                    <v-col cols="3">
                        <v-text-field outlined dense type="date" v-model="novedad.fecha_novedad"
                            label="Fecha de la novedad" :rules="[campoRequerido]"
                            :error-messages="errors.fecha_novedad" />
                    </v-col>
                    <v-col cols="12">
                        <v-textarea outlined auto-grow dense v-model="novedad.motivo" label="Descripción de la novedad"
                            counter="500" :rules="[campoRequerido, minimoCaracteres]" :error-messages="errors.motivo" />
                    </v-col>
                </v-row>

                <v-file-input v-model="adjuntos" label="Adjuntar archivos" multiple outlined dense
                    accept=".jpg,.jpeg,.pdf" />

            </v-form>
            <v-divider class="my-4"></v-divider>

            <h4 class="text-subtitle-1 mb-2 d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-history</v-icon>
                Historial de Novedades
            </h4>

            <v-data-table disable-pagination :items="novedades" hide-default-footer dense outlined class="mt-2"
                :headers="headersNovedades" :items-per-page="5" no-data-text="No hay novedades registradas aún."
                loading-text="cargando..." :loading="isLoading">
                <template v-slot:[`item.fecha_novedad`]="{ item }">
                    {{ new Date(item.fecha_novedad).toLocaleDateString() }}
                </template>

                <template v-slot:[`item.tipo_novedad_afiliado.nombre`]="{ item }">
                    {{ item.tipo_novedad?.nombre || '—' }}
                </template>

                <template v-slot:[`item.usuario_registra`]="{ item }">
                    {{ item.usuario?.operador ? `${item.usuario.operador.nombre} ${item.usuario.operador.apellido}` :
                        '—' }}
                </template>

            </v-data-table>

            <v-row no-gutters class="d-flex align-center justify-space-between px-2 my-2">
                <v-col cols="auto">
                    <v-pagination v-model="pagina" :length="total" :total-visible="7" class="my-0"
                        @input="getNovedad" />
                </v-col>

                <v-col cols="auto" style="min-width: 120px;">
                    <v-select v-model="opcionActual" :items="opciones" dense solo hide-details style="max-width: 100px;"
                        @change="getNovedad" />
                </v-col>
            </v-row>


        </v-card-text>

        <v-card-actions>
            <v-spacer />
            <v-btn small color="error" @click="$emit('cerrar')">Cancelar</v-btn>
            <v-btn small color="success" @click="guardarNovedad">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>


<script>
export default {
    name: "ModalNovedad",
    props: {
        afiliado: {
            type: Object,
            required: true,
        },
    },
    emits: ["novedad-creada", "cerrar"],

    data() {
        return {
            tiposNovedades: [],
            novedad: {
                tipo_novedad_afiliados_id: null,
                fecha_novedad: null,
                motivo: null,
            },
            adjuntos: [],
            errors: {},

            campoRequerido: v => !!v || 'Este campo es obligatorio',
            minimoCaracteres: v => (v && v.length >= 10) || 'Mínimo 10 caracteres',

            headersNovedades: [
                { text: "Fecha", value: "fecha_novedad" },
                { text: "Tipo de Novedad", value: "tipo_novedad_afiliado.nombre" },
                { text: "Motivo", value: "motivo" },
                { text: "Usuario registra", value: "usuario_registra" },
            ],
            isLoading: false,
            pagina: 1,
            opcionActual: 5,
            opciones: [5, 10, 15, 20],
            total: 0,
            novedades: [],
        };
    },
    mounted() {
        this.getTipoNovedad();
        this.getNovedad();
        this.$emit("solicitar-novedades", this.afiliado.id);
    },
    watch: {
        loading(val) {
            this.isLoading = val;
        },
    },
    methods: {
        getTipoNovedad() {
            this.$axios.get("/tipo-novedad-afiliado").then((res) => {
                this.tiposNovedades = res.data.data;
            }).catch(() => {
                this.$toast.error("Error al cargar tipos de novedad");
            });
        },

        guardarNovedad() {
            const formValid = this.$refs.form.validate();

            if (!formValid) {
                this.$toast.error("Por favor completa los campos obligatorios.");
                return;
            }

            const formData = new FormData();
            formData.append("fecha_novedad", this.novedad.fecha_novedad);
            formData.append("motivo", this.novedad.motivo);
            formData.append("tipo_novedad_id", this.novedad.tipo_novedad_afiliados_id);
            formData.append("afiliado_id", this.afiliado.id);

            this.adjuntos.forEach((file, index) => {
                formData.append(`adjuntos[${index}]`, file);
            });

            this.$axios.post(`/novedad-afiliado/crear/${this.afiliado.id}`, formData).then(() => {
                this.$toast.success("Novedad registrada con éxito");
                this.$emit('novedad-creada', this.afiliado.id);
                this.$emit("solicitar-novedades", this.afiliado.id);
                this.resetForm();
                this.getNovedad();
                this.$emit("cerrar");
            }).catch((error) => {
                this.errors = error.response?.data?.errors || {};
                this.$toast.error("Error al registrar novedad");
            })
        },

        resetForm() {
            this.novedad = {
                tipo_novedad_afiliados_id: null,
                fecha_novedad: null,
                motivo: null,
            };
            this.adjuntos = [];
            this.errors = {};
        },

        getNovedad() {
            if (!this.afiliado?.id) return;

            this.isLoading = true;
            const url = `/novedad-afiliado/novedadAfiliado/${this.afiliado.id}?page=${this.pagina}&cant=${this.opcionActual}`;

            this.$axios.post(url).then((res) => {
                this.novedades = res.data.data;
                this.total = res.data.last_page;
            }).catch(() => {
                this.$toast.error("Error al cargar novedades");
            }).finally(() => {
                this.isLoading = false;
            });
        },
    },
};
</script>
