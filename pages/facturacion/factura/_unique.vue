<template>
    <v-row>
        <v-col class="mx-auto" cols="12" sm="12" md="8">
            <v-card :loading="loading" :diasable="loading">
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Factura {{ factura.numero }}</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn small color="primary" class="mb-2 white--text" @click="dialog = true"
                            to="/facturacion/emitidas">
                            Volver al listado
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text>

                    <v-row>
                        <v-col cols="12" md="6">
                            <h4># Factura</h4>
                            <p>{{ factura.numero }}</p>

                            <h4>Fecha</h4>
                            <p>{{ $moment(factura.fecha).format('Y-MM-D') }}</p>

                            <h4>Cliente</h4>
                            <p>{{ factura.cliente.nombre }}</p>

                            <h4>Total</h4>
                            <p>{{ $formatPesos(factura.total) }}</p>
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="mb-4">
                                <h4>Estado en DIAN</h4>
                                <v-chip :color="factura.emitida ? 'green' : 'red'" dark>
                                    {{ factura.emitida ? 'Emitida' : 'No Emitida' }}
                                </v-chip>
                            </div>

                            <div v-if="!factura.emitida">
                                <v-btn @click="emitirDian()" outlined color="primary">
                                    <v-icon small class="mr-2" color="primary">
                                        mdi-send
                                    </v-icon>
                                    Emitir a DIAN
                                </v-btn>
                            </div>

                            <div v-if="factura.emitida">
                                <h4>Cufe</h4>
                                <p>{{ factura.cufe }}</p>

                                <v-btn @click="descargar()" block class="mb-3">
                                    <v-icon color="success">
                                        mdi-xml
                                    </v-icon>
                                    <span class="ml-2">Descargar xml</span>
                                </v-btn>

                                <v-btn @click="generarSoporte()" block>
                                    <v-icon color="success">
                                        mdi-folder-zip-outline
                                    </v-icon>
                                    <span class="ml-2">Generar soporte</span>
                                </v-btn>



                            </div>
                        </v-col>

                    </v-row>


                </v-card-text>

                <v-card-text>
                    <v-data-table :headers="headers" :items="factura.detalles" :search="search">

                        <template v-slot:top>
                            <v-text-field v-model="search" label="Buscar ..." class="mx-4" dense
                                outlined></v-text-field>
                        </template>

                        <template v-slot:item.precio_unitario="{ item }">
                            {{ $formatPesos(item.precio_unitario) }}
                        </template>

                        <template v-slot:item.total="{ item }">
                            {{ $formatPesos(item.total) }}
                        </template>

                    </v-data-table>
                </v-card-text>

            </v-card>
        </v-col>
    </v-row>
</template>
<script>
export default {
    name: "Emitidas",
    data() {
        return {
            factura: {
                id: null,
                numero: 'esperando...',
                total: 0,
                fecha: null,
                emitida: null,
                cufe: null,
                cliente: {
                    nombre: null
                },
                detalles: []
            },
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Descripcion', value: 'descripcion' },
                { text: 'Cantidad', value: 'cantidad' },
                { text: 'Precio Unidad', value: 'precio_unitario' },
                { text: 'Total', value: 'total' },
            ],
            search: null,
            loading: false,
        }
    },
    mounted() {
        this.fetchFactura();
    },
    computed: {
        unique() {
            return this.$route.params.unique;
        }
    },
    methods: {
        async fetchFactura() {
            try {
                this.loading = true;
                const response = await this.$axios.get(`/facturacion/consultar/${this.unique}`);
                this.factura = response.data;
            } catch (error) {
                console.error("Error fetching factura:", error);
            } finally {
                this.loading = false;
            }
        },

        async descargar() {
            try {
                const response = await this.$axios.post('/facturacion/descargar-zip/' + this.factura.unique)
                window.open(response.data, '_blank');
            } catch (error) {
                console.log('problema imprimiendo');
            }
        },

        async emitirDian() {
            try {
                if (this.factura.emitida) {
                    return;
                }
                this.loading = true;
                const response = await this.$axios.post('/facturacion/emitir-dian/' + this.factura.unique)
                this.factura = response.data
            } catch (error) {
                console.error("Error emitiendo factura:", error);
            } finally {
                this.loading = false;
            }
        },

        async generarSoporte() {
            if (!this.factura.emitida) {
                return;
            }

            try {
                const respone = await this.$axios.post('/facturacion/generar-soporte/' + this.factura.unique)
                console.log(response);
            } catch (error) {
                console.log('error');
            }


        }
    }
}
</script>