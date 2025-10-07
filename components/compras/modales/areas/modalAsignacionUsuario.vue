<template>
    <div>
        <v-card :loading="loadingOperadores">
            <v-alert icon="mdi-home-group" text dense color="info" border="left">
                <b>Agregar usuarios al área {{ area.nombre }}</b>
            </v-alert>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete label="Usuarios" dense outlined v-model="user.operador"
                                :search-input.sync="busquedaOperador" :items="operadores"
                                :item-text="operadorNombreApellido" item-value="id"
                                no-data-text="Ingresa 4 dígitos para realizar la búsqueda" @input="agregarOperadorArray"
                                :loading="loading" />
                        </v-col>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-alert text dense color="blue-grey" border="bottom"><b>Usuarios Asociados</b></v-alert>
                <v-chip-group column>
                    <v-chip v-for="operador in operadoresSeleccionados" :key="'operador-' + operador.id" close
                        @click:close="eliminarOperador(operador.id)">
                        {{ operador?.nombre || '' }}
                    </v-chip>

                    <v-chip v-for="user in operadoresSeleccionados.flatMap(
                        (o) => o.users
                    )" :key="'user-' + user.id + '-operador-' + user.operador_id
                        " close @click:close="eliminarUsuario(user.id)">
                        {{ user?.operador?.nombre }} -
                        {{ user?.operador?.apellido }}
                    </v-chip>
                </v-chip-group>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarDialog">Cerrar</v-btn>
                <v-btn color="success" small dark @click="guardarOperadores" :loading="loadingGuardar">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
export default {
    props: {
        area: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            user: {
                operador: "",
            },
            operadores: [],
            operadoresSeleccionados: [],
            busquedaOperador: null,
            loading: false,
            loadingOperadores: false,
            loadingGuardar: false,
        };
    },

    watch: {
        busquedaOperador(val) {
            if (val) {
                if (val.length === 4) {
                    this.buscarOperadores();
                } else if (val.length < 4) {
                    this.operadores = null;
                }
            } else {
                this.operadores = null;
            }
        },
    },

    methods: {
        buscarOperadores() {
            this.loading = true;
            this.$axios
                .get(`/operador/listar`)
                .then((res) => {
                    this.operadores = res.data;
                })
                .catch((err) => {
                    this.$toast.error("Error al buscar los operadores");
                    console.error(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        agregarOperadorArray() {
            const operador = this.operadores.find(
                (item) => item.id === this.user.operador
            );
            if (
                operador &&
                !this.operadoresSeleccionados.some((o) => o.id === operador.id)
            ) {
                this.operadoresSeleccionados.push(operador);
                this.user.operador = "";
            }
        },

        eliminarOperador(operadorId) {
            this.operadoresSeleccionados = this.operadoresSeleccionados.filter(
                (operador) => operador.user_id !== operadorId
            );
        },

        eliminarUsuario(userId) {
            this.operadoresSeleccionados = this.operadoresSeleccionados.filter(
                (operador) =>
                    !operador.users.some((user) => user.id === userId)
            );
        },

        guardarOperadores() {
            const operadorIds = this.operadoresSeleccionados.map(
                (operador) => operador.id
            );
            this.loadingGuardar = true;
            this.$axios
                .post(`/areas-proveedores/asignar-usuarios/` + this.area.id, {
                    operadores: operadorIds,
                })
                .then((res) => {
                    this.$toast.success("Operadores agregados correctamente");
                    this.cerrarDialog();
                })
                .catch((err) => {
                    this.$toast.error("Error al guardar los operadores");
                    console.error(err);
                })
                .finally(() => {
                    this.loadingGuardar = false;
                });
        },

        cargarOperadores() {
            this.loadingOperadores = true;
            this.$axios
                .get(`/areas-proveedores/listar-operadores/${this.area.id}`)
                .then((res) => {
                    this.operadoresSeleccionados = res.data ?? '';
                })
                .catch((err) => {
                    this.$toast.error("Error al cargar los operadores");
                    console.error(err);
                })
                .finally(() => {
                    this.loadingOperadores = false;
                });
        },

        cerrarDialog() {
            this.$emit("cerrar");
        },

        operadorNombreApellido(item) {
            if (!item || !item.nombre || !item.apellido) return '';
            return `${item.nombre} ${item.apellido}`;
        }

    },
};
</script>
