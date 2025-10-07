<template>
    <div>
        <v-card>
            <v-alert class="text-center" type="info" icon="mdi-checkbox-marked-circle-plus-outline" dense text
                border="left">
                <b>GENERAR RIPS</b>
            </v-alert>
            <v-card-text>
                <v-col cols="6" sm="4" md="4">
                    <v-select v-model="form.resolucion" dense :items="tipoResolucion" outlined
                        label="Seleccione tipo resolución *"></v-select>
                </v-col>
                <v-row v-if="form.resolucion === '3374'">
                    <v-col cols="6" sm="6" md="6">
                        <v-autocomplete v-model="form.tipo" :items="tipos" outlined label="Tipo *" item-value="nombre"
                            item-text="nombre" dense>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                        <v-autocomplete v-model="form.entidad" :items="entidades" outlined label="Entidad *"
                            item-value="id" item-text="nombre" dense @change="onEntidadChange">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6" sm="6" md="6" v-if="mostrarRegion">
                        <v-autocomplete v-model="form.region" :items="regiones" label="Región *" outlined
                            item-value="id" item-text="nombre" dense>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="form.fecha_inicio" label="Fecha Inicio *" outlined type="date" dense>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="form.fecha_fin" label="Fecha Fin *" outlined type="date" dense>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                        <v-alert class="text-center" dense text outlined type="info"
                            icon="mdi-checkbox-multiple-marked">
                            A este correo llegará la información para descargar
                            el ZIP
                        </v-alert>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="form.email" label="Correo Electronico *" outlined type="email" dense
                            :rules="correoRule">
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                        <v-btn @click="generarRips()" small dark color="success">Generar RIPS</v-btn>
                    </v-col>

                    <v-spacer class="mt-3"></v-spacer>
                </v-row>
                <v-row v-if="form.resolucion === '2275'">
                    <v-col cols="6" sm="5" md="5">
                        <v-autocomplete v-model="form.entidad" :items="entidades" outlined label="Entidad *"
                            item-value="id" item-text="nombre" dense @change="onEntidadChange">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6" sm="3" md="3" v-if="mostrarRegion">
                        <v-autocomplete v-model="form.region" :items="regiones" label="Región *" outlined
                            item-value="id" item-text="nombre" dense>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6" sm="4" md="4">
                        <v-autocomplete v-model="form.tipo" :items="tipos" outlined label="Tipo *" item-value="nombre"
                            item-text="nombre" dense>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="8" md="8">
                        <v-autocomplete :items="listaReps" v-model="form.codigo_habilitacion_reps" outlined dense
                            label="Nit o Nombre de la sede del Prestador (Institución a la que pertenece el usuario)  *"
                            :search-input.sync="campoBusquedaRep" :loading="loading.reps"
                            no-data-text="Digite el nombre de la sede para buscar." item-text="nombre"
                            item-value="codigo" required></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field v-model="form.fecha_inicio" label="Fecha Inicio *" outlined type="date" dense>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-text-field v-model="form.fecha_fin" label="Fecha Fin *" outlined type="date" dense>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                        <v-alert class="text-center" dense text outlined type="info"
                            icon="mdi-checkbox-multiple-marked">
                            A este correo llegará la información para descargar
                            el ZIP
                        </v-alert>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="form.email" label="Correo Electronico *" outlined type="email" dense
                            :rules="correoRule">
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                        <v-btn @click="generarRips()" small dark color="success">Generar RIPS</v-btn>
                    </v-col>

                    <v-spacer class="mt-3"></v-spacer>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";
    import {
        correoRule
    } from "../../utils/rules";

    export default {
        data() {
            return {
                loading: {
                    reps: false,
                },
                tipoResolucion: ['2275', '3374'],
                correoRule,
                region: null,
                listaReps: [],
                campoBusquedaRep: null,
                form: {
                    tipo: null,
                    entidad: null,
                    region: null,
                    fecha_inicio: null,
                    fecha_fin: null,
                    user_id: this.$store.state.auth.usuario.id,
                    email: null,
                    codigo_habilitacion_reps: null,
                    resolucion: null,
                },
                entidades: [],
                regiones: [{
                        id: "ANTIOQUIA",
                        nombre: "ANTIOQUIA"
                    },
                    {
                        id: "CHOCO",
                        nombre: "CHOCO"
                    },
                    {
                        id: "",
                        nombre: "Sin Región"
                    },
                ],
                tipos: [{
                        id: 1,
                        nombre: "ODONTOLOGICO"
                    },
                    {
                        id: 2,
                        nombre: "CONSOLIDADO RIPS SUMIMEDICAL"
                    }
                ],
                mostrarRegion: false,
            };
        },
        created() {
            this.obtenerEntidades();
        },
        watch: {

            campoBusquedaRep(newVal) {
                if (newVal && newVal.length === 4) {
                    this.listarReps();
                }
            },
        },
        methods: {
            ...mapActions("app", ["setPreload"]),

            obtenerEntidades() {
                this.$axios
                    .get("/entidad/listarFomagFerroRips")
                    .then((response) => {
                        this.entidades = response.data;
                    })
                    .catch((error) => {
                        console.error("Error al obtener entidades:", error);
                    });
            },
            onEntidadChange() {
                this.mostrarRegion = this.form.entidad === 1;
            },
            async generarRips() {
                const {
                    entidad,
                    fecha_inicio,
                    fecha_fin,
                    email,
                    resolucion
                } = this.form;

                const camposRequeridos = [entidad, fecha_inicio, fecha_fin, email];
                if (camposRequeridos.some(campo => !campo)) {
                    this.$toast.error("Por favor completa todos los campos obligatorios.");
                    return;
                }

                this.setPreload(true);

                try {
                    const {
                        data
                    } = await this.$axios.post("/rips/generarRips", this.form);

                    if (resolucion === "2275") {
                        this.$toast.success("Los Rips se enviaran  a su correo por favor , revise la bandeja de entrada del correo");
                        this.limpiarCampos();
                    } else {
                        this.$toast.success(
                            `Los Rips se enviaran a su correo por favor , revise la bandeja de entrada del correo ${email}`
                        );
                        this.limpiarCampos();
                    }
                } catch (error) {
                    this.$toast.error("Ha ocurrido un error al generar los Rips");
                } finally {
                    this.setPreload(false);
                }
            },


            limpiarCampos() {
                this.form = {
                    tipo: null,
                    entidad: null,
                    region: null,
                    fecha_inicio: null,
                    fecha_fin: null,
                    user_id: this.$store.state.auth.usuario.id,
                    email: null,
                    codigo_habilitacion_reps: null,
                    resolucion: null,
                };
                this.campoBusquedaRep = null;
            },

            listarReps() {
                this.loading.reps = true;
                this.$axios
                    .get(`/reps/buscarRep/${this.campoBusquedaRep}`)
                    .then((res) => {
                        this.listaReps = res.data.map((rep) => {
                            return {
                                id: rep.id,
                                nombre: `${rep.nombre} - ${rep.codigo}`,
                                codigo: rep.codigo,
                            };
                        });
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al cargar los reps");
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading.reps = false;
                    });
            },
        },
    };

</script>
