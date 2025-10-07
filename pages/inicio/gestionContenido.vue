<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Gestión de Contenido</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-tabs v-model="tab" grow>
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab @click="listarManuales()" key="tabManuales"> MANUALES </v-tab>
                    <v-tab @click="listarVideos()" key="tabVideos"> VIDEOS </v-tab>
                    <v-tab @click="listarImagenesSoporte()" key="tabSoporte">
                        Soporte
                    </v-tab>
                    <v-tab @click="listarImagenes()" key="tabImagenes">
                        Piezas informativas
                    </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                    <!-- Manuales -->
                    <v-tab-item key="tabManuales">
                        <!-- Filtro y Botones -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12" class="text-right">
                                <v-btn color="primary" small @click="abrirCrearManual()">
                                    Nuevo Manual
                                </v-btn>
                            </v-col>
                        </v-row>
                        <!-- Tabla -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersManuales" :items="manuales"
                                    :loading="loading.tablaManuales" loading-text="Cargando... por favor espere" dense
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.descripcion`]="{ item }">
                                        {{ item.descripcion | truncate(150) }}
                                    </template>
                                    <template v-slot:[`item.activo`]="{ item }">
                                        <v-chip small dark :color="item.activo ? 'success' : 'error'">
                                            {{ item.activo ? "Si" : "No" }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.acciones`]="{ item }">
                                        <div style="
                        display: flex;
                        gap: 0.4rem;
                        justify-content: center;
                      ">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on" color="warning"
                                                        @click="abrirEditarManual(item)">
                                                        mdi-pencil
                                                    </v-icon>
                                                </template>
                                                <span>Editar Manual</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on"
                                                        :color="item.activo ? 'error' : 'success'"
                                                        @click="cambiarEstadoManual(item)">
                                                        {{
                              item.activo
                                ? "mdi-toggle-switch-off"
                                : "mdi-toggle-switch"
                            }}
                                                    </v-icon>
                                                </template>
                                                <span>{{
                            item.activo ? "Inactivar" : "Activar"
                          }}
                                                    Manual</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <!-- Videos -->
                    <v-tab-item key="tabVideos">
                        <!-- Filtro y Botones -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12" class="text-right">
                                <v-btn color="primary" small @click="abrirCrearVideo()">
                                    Nuevo Video
                                </v-btn>
                            </v-col>
                        </v-row>
                        <!-- Tabla -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersVideos" :items="videos" :loading="loading.tablaVideos"
                                    loading-text="Cargando... por favor espere" dense
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.descripcion`]="{ item }">
                                        {{ item.descripcion | truncate(150) }}
                                    </template>
                                    <template v-slot:[`item.activo`]="{ item }">
                                        <v-chip small dark :color="item.activo ? 'success' : 'error'">
                                            {{ item.activo ? "Si" : "No" }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.acciones`]="{ item }">
                                        <div style="
                        display: flex;
                        justify-content: center;
                        gap: 0.5rem;
                      ">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on" color="warning"
                                                        @click="abrirEditarVideo(item)">
                                                        mdi-pencil
                                                    </v-icon>
                                                </template>
                                                <span>Editar Video</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on"
                                                        :color="item.activo ? 'error' : 'success'"
                                                        @click="cambiarEstadoVideo(item)">
                                                        {{
                              item.activo
                                ? "mdi-toggle-switch-off"
                                : "mdi-toggle-switch"
                            }}
                                                    </v-icon>
                                                </template>
                                                <span>{{
                            item.activo ? "Inactivar" : "Activar"
                          }}
                                                    Video</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <!-- Soporte -->
                    <v-tab-item key="tabSoporte">
                        <!-- Filtro y Botones -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12" class="text-right">
                                <v-btn color="primary" small @click="abrirCrearSoporte()">
                                    Nueva imagen
                                </v-btn>
                            </v-col>
                        </v-row>
                        <!-- Tabla -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersSoportes" :items="soportes"
                                    :loading="loading.tablaSoportes" loading-text="Cargando... por favor espere" dense
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.descripcion`]="{ item }">
                                        {{ item.descripcion | truncate(150) }}
                                    </template>
                                    <template v-slot:[`item.activo`]="{ item }">
                                        <v-chip small dark :color="item.activo ? 'success' : 'error'">
                                            {{ item.activo ? "Si" : "No" }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.acciones`]="{ item }">
                                        <div style=" display: flex;justify-content: center;gap: 0.5rem;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on"
                                                        :color="item.activo ? 'error' : 'success'"
                                                        @click="cambiarEstadoImagenSoporte(item)">
                                                        {{
                                                         item.activo
                                                            ? "mdi-toggle-switch-off"
                                                            : "mdi-toggle-switch"
                                                        }}
                                                    </v-icon>
                                                </template>
                                                <span>{{ item.activo ? "Inactivar" : "Activar" }} imagen</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on" color="error"
                                                        @click="eliminarImagenSoporte(item)">
                                                        mdi-delete
                                                    </v-icon>
                                                </template>
                                                <span>eliminar imagen</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <v-tab-item key="tabImagenes">
                        <!-- Filtro y Botones -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12" class="text-right">
                                <v-btn color="primary" small @click="abrirCrearImagen()">
                                    Nueva imagen
                                </v-btn>
                            </v-col>
                        </v-row>
                        <!-- Tabla -->
                        <v-row dense class="mt-2">
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersImagenes" :items="imagenes"
                                    :loading="loading.tablaImagenes" loading-text="Cargando... por favor espere" dense
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.activo`]="{ item }">
                                        <v-chip small dark :color="item.activo ? 'success' : 'error'">
                                            {{ item.activo ? "Si" : "No" }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.acciones`]="{ item }">
                                        <div style="display: flex; justify-content: center; gap: 0.5rem">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on"
                                                        :color="item.activo ? 'error' : 'success'"
                                                        @click="cambiarEstadoImagen(item)">
                                                        {{
                                                         item.activo
                                                            ? "mdi-toggle-switch-off"
                                                            : "mdi-toggle-switch"
                                                        }}
                                                    </v-icon>
                                                </template>
                                                <span>{{ item.activo ? "Inactivar" : "Activar" }} imagen</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on" color="error"
                                                        @click="eliminarImagen(item)">
                                                        mdi-delete
                                                    </v-icon>
                                                </template>
                                                <span>eliminar imagen</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
        </v-card>

        <!-- Dialogs -->
        <modalCrearManual :mostrarCrearManual.sync="mostrarCrearManual" @crearManual="crearManual"></modalCrearManual>

        <modalEditarManual :mostrarEditarManual.sync="mostrarEditarManual" :manual="manualSeleccionado"
            @editarManual="editarManual"></modalEditarManual>

        <modalCrearVideo :mostrarCrearVideo.sync="mostrarCrearVideo" @crearVideo="crearVideo"></modalCrearVideo>

        <modalEditarVideo :mostrarEditarVideo.sync="mostrarEditarVideo" :video="videoSeleccionado"
            @editarVideo="editarVideo"></modalEditarVideo>

        <modalCrearBoletin :mostrarCrearBoletin.sync="mostrarCrearBoletin" @crearBoletin="crearImagenSoporte">
        </modalCrearBoletin>


        <modalCrearImagen :mostrarCrearImagen.sync="mostrarCrearImagen" @crearImagen="crearImagen"></modalCrearImagen>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";
    import modalCrearManual from "@/components/inicio/modalCrearManual.vue";
    import modalEditarManual from "@/components/inicio/modalEditarManual.vue";
    import modalCrearVideo from "@/components/inicio/modalCrearVideo.vue";
    import modalEditarVideo from "@/components/inicio/modalEditarVideo.vue";
    import modalCrearBoletin from "@/components/inicio/modalCrearBoletin.vue";
    import modalCrearImagen from '@/components/inicio/modalCrearImagen.vue';
    import {
        limpiarNombreArchivo
    } from "~/utils/limpiarNombreArchivo";

    export default {
        name: "gestionContenido",
        middleware({
            $can,
            redirect
        }) {
            if (!$can("inicio.gestionContenido")) {
                return redirect("/");
            }
        },
        components: {
            modalCrearManual,
            modalEditarManual,
            modalCrearVideo,
            modalEditarVideo,
            modalCrearBoletin,
            modalCrearImagen
        },
        data() {
            return {
                tab: "tabManuales",
                loading: {
                    tablaManuales: false,
                    tablaVideos: false,
                    tablaSoportes: false,
                    tablaImagenes: false,
                },
                manuales: [],
                headersManuales: [{
                        text: "N°",
                        value: "id",
                        align: "center"
                    },
                    {
                        text: "Nombre",
                        value: "nombre",
                        align: "center"
                    },
                    {
                        text: "Descripción",
                        value: "descripcion"
                    },
                    {
                        text: "Activo",
                        value: "activo"
                    },
                    {
                        text: "Cargado Por",
                        value: "cargado_por.operador.nombre_completo"
                    },
                    {
                        text: "Acciones",
                        value: "acciones",
                        align: "center",
                        sortable: false,
                    },
                ],
                videos: [],
                headersVideos: [{
                        text: "N°",
                        value: "id",
                        align: "center"
                    },
                    {
                        text: "Nombre",
                        value: "nombre",
                        align: "center"
                    },
                    {
                        text: "Descripción",
                        value: "descripcion"
                    },
                    {
                        text: "Enlace",
                        value: "url"
                    },
                    {
                        text: "Activo",
                        value: "activo"
                    },
                    {
                        text: "Cargado Por",
                        value: "cargado_por.operador.nombre_completo"
                    },
                    {
                        text: "Acciones",
                        value: "acciones",
                        align: "center",
                        sortable: false,
                    },
                ],
                soportes: [],
                headersSoportes: [{
                        text: "N°",
                        value: "id",
                        align: "center"
                    },
                    {
                        text: "Nombre",
                        value: "nombre",
                        align: "center"
                    },
                    {
                        text: "Activo",
                        value: "activo"
                    },
                    // {
                    //     text: "Cargado Por",
                    //     value: "cargado_por.operador.nombre_completo"
                    // },
                    {
                        text: "Acciones",
                        value: "acciones",
                        align: "center",
                        sortable: false,
                    },
                ],
                headersImagenes: [{
                        text: "N°",
                        value: "id",
                        align: "center"
                    },
                    {
                        text: "Nombre",
                        value: "nombre",
                        align: "center"
                    },
                    {
                        text: "Activo",
                        value: "activo"
                    },
                    //   {
                    //     text: "Cargado Por",
                    //     value: "user.operador.nombre_completo"
                    //   },
                    {
                        text: "Acciones",
                        value: "acciones",
                        align: "center",
                        sortable: false,
                    },
                ],
                mostrarCrearManual: false,
                mostrarCrearVideo: false,
                mostrarEditarManual: false,
                mostrarEditarVideo: false,
                mostrarCrearBoletin: false,
                manualSeleccionado: {},
                videoSeleccionado: {},
                imagenes: [],
                mostrarCrearImagen: false,
            };
        },
        filters: {
            truncate(value, limit) {
                if (value.length > limit) {
                    return value.substring(0, limit) + "...";
                }
                return value;
            },
        },
        created() {
            this.listarManuales();
            this.listarVideos();
        },
        methods: {
            ...mapActions("app", ["setPreload"]),

            listarManuales() {
                this.loading.tablaManuales = true;
                this.$axios
                    .get("manuales/listarTodos")
                    .then((res) => {
                        this.manuales = res.data;
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al cargar los manuales");
                    })
                    .finally(() => {
                        this.loading.tablaManuales = false;
                    });
            },

            abrirCrearManual() {
                this.mostrarCrearManual = true;
                console.log("abrirCrearManual");
            },

            crearManual(data) {
                this.setPreload(true);

                const uuid = window.crypto.randomUUID();
                data.adjunto = {
                    name: limpiarNombreArchivo(data.adjunto.name),
                    uuid: window.crypto.randomUUID(),
                    size: data.adjunto.size,
                    type: data.adjunto.type,
                    file: data.adjunto
                };

                const formData = new FormData();
                formData.append("nombre", data.nombre);
                formData.append("descripcion", data.descripcion);
                formData.append("adjunto", data.adjunto.name);

                data.tipos_usuario.forEach((tipo) => {
                    formData.append("tipos_usuario[]", tipo);
                });

                this.$axios.post("/manuales/crearManual", formData)
                    .then((res) => {
                        if (res.data.url) {
                            this.$toast.success("Manual creado con éxito");

                            const archivoUrl = res.data.url.url;
                            this.subirArchivo(data.adjunto, archivoUrl);
                            this.listarManuales();
                        } else {
                            this.$toast.error("La URL del archivo no está disponible.");
                        }
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al crear el manual");
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            },

            async subirArchivo(archivo, url) {
                try {
                    const formData = new FormData();
                    formData.append("file", archivo);

                    await this.$axios.put(url, formData, {
                        headers: {
                            "Content-Type": archivo.type
                        },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            console.log(`Progreso de subida: ${percentCompleted}%`);
                        },
                    });

                    this.$toast.success("Archivo subido correctamente.");
                } catch (error) {
                    this.$toast.error("Error al subir el archivo.");
                }
            },

            abrirEditarManual(manual) {
                this.manualSeleccionado = manual;
                this.mostrarEditarManual = true;
            },
            editarManual(manualEditado) {
                const formData = new FormData();
                formData.append("nombre", manualEditado.nombre);
                formData.append("descripcion", manualEditado.descripcion);
                formData.append("adjunto", manualEditado.adjunto);

                if (Array.isArray(manualEditado.tipos_usuario)) {
                    manualEditado.tipos_usuario.forEach((tipo) => {
                        formData.append("tipos_usuarios[]", tipo);
                    });
                }

                this.setPreload(true);
                this.$axios
                    .post(`/manuales/actualizarManual/${manualEditado.id}`, formData)
                    .then((res) => {
                        this.$toast.success("Manual actualizado con éxito");
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al actualizar el manual");
                    })
                    .finally(() => {
                        this.setPreload(false);
                        this.listarManuales();
                    });
            },

            cambiarEstadoManual(manual) {
                this.$swal({
                    title: `¿Desea ${manual.activo ? "inactivar" : "activar"} este manual?`,
                    text: "Se cambiará el estado del manual",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Si, ${manual.activo ? "inactivar" : "activar"}`,
                    cancelButtonText: "Cancelar",
                }).then((res) => {
                    if (res.value) {
                        this.setPreload(true);
                        this.$axios
                            .post("/manuales/cambiarEstadoManual", {
                                id: manual.id
                            })
                            .then((res) => {
                                this.$toast.success(`Manual actualizado con exito`);
                                this.listarManuales();
                            })
                            .catch((e) => {
                                this.$toast.error(
                                    "Ocurrió un error al cambiar el estado del manual"
                                );
                            })
                            .finally(() => {
                                this.setPreload(false);
                            });
                    }
                });
            },

            listarVideos() {
                this.loading.tablaVideos = true;
                this.$axios
                    .get("videos/listarTodos")
                    .then((res) => {
                        this.videos = res.data;
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al cargar los videos");
                    })
                    .finally(() => {
                        this.loading.tablaVideos = false;
                    });
            },

            abrirCrearVideo() {
                this.mostrarCrearVideo = true;
            },

            crearVideo(data) {
                this.setPreload(true);
                this.$axios
                    .post("/videos/crearVideo", data)
                    .then((res) => {
                        this.$toast.success("Video creado con éxito");
                        this.listarVideos();
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al crear el video");
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            },

            abrirEditarVideo(video) {
                this.videoSeleccionado = video;
                this.mostrarEditarVideo = true;
            },

            editarVideo(videoEditado) {
                this.setPreload(true);
                this.$axios
                    .post(`/videos/actualizarVideo/${videoEditado.id}`, videoEditado)
                    .then((res) => {
                        this.$toast.success("Video actualizado con éxito");
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al actualizar el video");
                    })
                    .finally(() => {
                        this.setPreload(false);
                        this.listarVideos();
                    });
            },

            cambiarEstadoVideo(video) {
                this.$swal({
                    title: `¿Desea ${video.activo ? "inactivar" : "activar"} este video?`,
                    text: "Se cambiará el estado del video",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Si, ${video.activo ? "inactivar" : "activar"}`,
                    cancelButtonText: "Cancelar",
                }).then((res) => {
                    if (res.value) {
                        this.setPreload(true);
                        this.$axios
                            .post("/videos/cambiarEstadoVideo", {
                                id: video.id
                            })
                            .then((res) => {
                                this.$toast.success(`Video actualizado con exito`);
                                this.listarVideos();
                            })
                            .catch((e) => {
                                this.$toast.error(
                                    "Ocurrió un error al cambiar el estado del video"
                                );
                            })
                            .finally(() => {
                                this.setPreload(false);
                            });
                    }
                });
            },

            listarImagenesSoporte() {
                this.loading.tablaSoportes = true;
                this.$axios
                    .get("imagenes-soporte/listarTodos")
                    .then((res) => {
                        this.soportes = res.data;
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al cargar los soportes");
                    })
                    .finally(() => {
                        this.loading.tablaSoportes = false;
                    });
            },

            abrirCrearSoporte() {
                this.mostrarCrearBoletin = true;
            },

            crearImagenSoporte(data) {
                this.setPreload(true);

                const formData = new FormData();
                formData.append("nombre", data.nombre);
                formData.append("adjunto", data.adjunto);
                this.$axios
                    .post("imagenes-soporte/crearImagen", formData)
                    .then((res) => {
                         this.$toast.success("Imagen de soporte creada con éxito");
                         this.listarImagenesSoporte();
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al crear la imagen");
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            },


            cambiarEstadoImagenSoporte(imagen) {
                this.$swal({
                    title: `¿Desea ${imagen.activo ? "inactivar" : "activar"} esta imagen?`,
                    text: "Se cambiará el estado de la imagen",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Si, ${imagen.activo ? "inactivar" : "activar"}`,
                    cancelButtonText: "Cancelar",
                }).then((res) => {
                    if (res.value) {
                        this.setPreload(true);
                        this.$axios
                            .post("imagenes-soporte/cambiarEstadoImagen", {
                                id: imagen.id,
                                activo:imagen.activo ? false:true
                            })
                            .then((res) => {
                                this.$toast.success(`imagen actualizada con exito`);
                                this.listarImagenesSoporte();
                            })
                            .catch((e) => {
                                this.$toast.error(
                                    "Ocurrió un error al cambiar el estado del imagen"
                                );
                            })
                            .finally(() => {
                                this.setPreload(false);
                            });
                    }
                });
            },

            listarImagenes() {
                this.loading.tablaImagenes = true;
                this.$axios.get("imagenes-inicio/listarTodos")
                    .then((res) => {
                        this.imagenes = res.data;
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al cargar las imagenes");
                    })
                    .finally(() => {
                        this.loading.tablaImagenes = false;
                    });
            },

            abrirCrearImagen() {
                this.mostrarCrearImagen = true;
            },

            crearImagen(data) {
                this.setPreload(true);

                const formData = new FormData();
                formData.append("nombre", data.nombre);
                formData.append("adjunto", data.adjunto);
                formData.append("user_id", this.$store.state.auth.usuario.id);

                this.$axios
                    .post("/imagenes-inicio/crearImagen", formData)
                    .then((res) => {
                        this.$toast.success("Imagen creada con exito");
                        this.listarImagenes();
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al crear la imagen");
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            },

            cambiarEstadoImagen(imagen) {
                this.$swal({
                    title: `¿Desea ${imagen.activo ? "inactivar" : "activar"} esta imagen?`,
                    text: "Se cambiará el estado de la imagen",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Si, ${imagen.activo ? "inactivar" : "activar"}`,
                    cancelButtonText: "Cancelar",
                }).then((res) => {
                    if (res.value) {
                        this.setPreload(true);
                        this.$axios
                            .post("/imagenes-inicio/cambiarEstadoImagen", {
                                id: imagen.id,
                                activo:imagen.activo ? false:true
                            })
                            .then((res) => {
                                this.$toast.success(`imagen actualizada con exito`);
                                this.listarImagenes();
                            })
                            .catch((e) => {
                                this.$toast.error(
                                    "Ocurrió un error al cambiar el estado del imagen"
                                );
                            })
                            .finally(() => {
                                this.setPreload(false);
                            });
                    }
                });
            },

            eliminarImagen(imagen) {
                this.$swal({
                    title: `¿Desea eliminar esta imagen?`,
                    text: "Se eliminará definitivamente la imagen",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Si, eliminar`,
                    cancelButtonText: "Cancelar",
                }).then((res) => {
                    if (res.value) {
                        this.setPreload(true);
                        this.$axios
                            .delete("/imagenes-inicio/eliminarImagen/"+imagen.id)
                            .then((res) => {
                                this.$toast.success(`imagen eliminada con exito`);
                                this.listarImagenes();
                            })
                            .catch((e) => {
                                this.$toast.error(
                                    "Ocurrió un error al tratar de eliminar imagen"
                                );
                            })
                            .finally(() => {
                                this.setPreload(false);
                            });
                    }
                });
            },

             eliminarImagenSoporte(imagen) {
                this.$swal({
                    title: `¿Desea eliminar esta imagen?`,
                    text: "Se eliminará definitivamente la imagen",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Si, eliminar`,
                    cancelButtonText: "Cancelar",
                }).then((res) => {
                    if (res.value) {
                        this.setPreload(true);
                        this.$axios
                            .delete("imagenes-soporte/eliminarImagen/"+imagen.id)
                            .then((res) => {
                                this.$toast.success(`imagen eliminada con exito`);
                                this.listarImagenesSoporte();
                            })
                            .catch((e) => {
                                this.$toast.error(
                                    "Ocurrió un error al tratar de eliminar imagen"
                                );
                            })
                            .finally(() => {
                                this.setPreload(false);
                            });
                    }
                });
            },
        },
    };

</script>
