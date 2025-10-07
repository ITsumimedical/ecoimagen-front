<template>
    <v-card class="pa-4">
        <v-row dense>
            <v-col cols="12" sm="8">
                <v-autocomplete v-model="marcacion" :items="clasificaciones" item-text="nombre" item-value="id"
                    label="Seleccione una clasificación" outlined dense :loading="loadingClasificaciones" clearable />
            </v-col>
            <v-btn small color="success" :loading="loading" :disabled="!marcacion" @click="crearMarcacion" class="mt-3">
                Marcar
            </v-btn>
        </v-row>

        <v-data-table class="elevation-0" loading-text="Cargando clasificaciones" dense :headers="headers"
            :items="marcaciones" :loading="loading">
            <template v-slot:[`item.estado`]="{ item }">
                <v-chip label :color="item.estado ? 'green' : 'red'" dark small>
                    {{ item.estado ? 'Activo' : 'Inactivo' }}
                </v-chip>
            </template>

            <template v-slot:[`item.accion`]="{ item }">
                <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" :color="item.estado ? 'red darken-1' : 'green darken-1'"
                            @click="actualizarEstado(item)" :loading="loading && idCambiar === item.id">
                            <v-icon>
                                {{ item.estado ? 'mdi-delete' : 'mdi-restore' }}
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>
                        {{ item.estado ? 'Eliminar clasificación' : 'Activar clasificación' }}
                    </span>
                </v-tooltip>
            </template>
        </v-data-table>

    </v-card>
</template>

<script>
export default {
    props: {
        datos: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            loadingClasificaciones: false,
            marcacion: '',
            clasificaciones: [],
            marcaciones: [],
            paginate: {
                total: 1,
                page: 1
            },
            idCambiar: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Clasificación', value: 'clasificacion_nombre' },
                { text: 'Descripción', value: 'descripcion' },
                { text: 'Estado', value: 'estado', align: 'center' },
                { text: 'Acción', value: 'accion', sortable: false }
            ]
        }
    },
    mounted() {
        this.listarClasificaciones()
        this.listarMarcaciones()
    },
    methods: {
        async listarClasificaciones() {
            this.loadingClasificaciones = true
            try {
                const response = await this.$axios.get('/clasificacion')
                this.clasificaciones = response.data
            } catch (error) {
                this.$toast?.error('Error al cargar clasificaciones')
            } finally {
                this.loadingClasificaciones = false
            }
        },
        async listarMarcaciones() {
            this.loading = true
            try {
                const response = await this.$axios.post(`/afiliacion-clasificacion/listar/${this.datos.id}`)

                this.marcaciones = response.data.map(marcacion => ({
                    ...marcacion,
                    clasificacion_nombre: marcacion.clasificacion?.nombre || 'Sin nombre',
                    descripcion: marcacion.clasificacion?.descripcion || '',
                }))
            } catch (error) {
                this.$toast?.error('Error al cargar marcaciones del afiliado')
            } finally {
                this.loading = false
            }
        },
        async crearMarcacion() {
            this.loading = true
            try {
                await this.$axios.post('/afiliacion-clasificacion/crear', {
                    afiliado_id: this.datos.id,
                    clasificacion_id: this.marcacion
                })
                this.$toast?.success('Marcación registrada')
                this.listarMarcaciones()
                this.marcacion = ''
            } catch (error) {
                this.$toast?.error('Error al marcar afiliado')
            } finally {
                this.loading = false
            }
        },
        async actualizarEstado(item) {
            this.idCambiar = item.id;
            this.loading = true;

            try {
                await this.$axios.put(`/afiliacion-clasificacion/actualizar-estado/${item.id}`, {
                    estado: !item.estado,
                });

                this.$toast.success("Estado actualizado correctamente");
                await this.listarMarcaciones();
            } catch (error) {
                this.$toast.error("Error al actualizar el estado");
            } finally {
                this.loading = false;
                this.idCambiar = null;
            }
        },
        editarMarcacion(item) {
            this.$toast?.info(`Editar aún no implementado para ID ${item.id}`)
        }
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 12px;
}
</style>
