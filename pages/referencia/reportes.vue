<template>
    <div>
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud !
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-card>
            <v-card-text flat>
                <v-col cols="12" sm="12" md="12">
                    <v-alert dense text outlined color="info" class="text-center">
                        REPORTE ANEXO TÉCNICO
                    </v-alert>
                </v-col>

                <v-row>
                    <v-col cols="12" sm="4" md="3">
                        <v-text-field type="date" label="Fecha Desde" v-model="fechaDesde" />
                    </v-col>
                    <v-col cols="12" sm="4" md="3">
                        <v-text-field type="date" label="Fecha Hasta" v-model="fechaHasta" />
                    </v-col>
                    <v-col cols="12" sm="4" md="3">
                        <v-btn color="orange" small dark @click="descargarReporte">
                            Descargar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    data: () => ({
        fechaDesde: '',
        fechaHasta: '',
        preload: false
    }),
    methods: {
        descargarReporte() {
            if (!this.fechaDesde || !this.fechaHasta) {
                this.$toast.error("Por favor, ingresa las fechas.");
                return;
            }
            const desde = new Date(this.fechaDesde);
            const hasta = new Date(this.fechaHasta);
            if (desde > hasta) {
                this.$toast.error("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return;
            }
            const diffTime = Math.abs(hasta - desde);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 7) {
                this.$toast.error("El rango del reporte no puede ser superior a una semana.");
                return;
            }
            this.preload = true
            this.$axios.post('/referencias/reporte', {
                f_inicial: this.fechaDesde,
                f_final: this.fechaHasta
            }, {
                responseType: 'blob'
            }).then(res => {
                let url = window.URL.createObjectURL(new Blob([res.data]));
                let link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ReporteAnexosTecnicos.xls');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                this.preload = false
            })
        }
    }
}
</script>