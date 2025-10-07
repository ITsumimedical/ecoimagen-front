<template>
	<v-card elevation="0">
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="" height="50px" width="50px"/>
						<span>Reporte {{ selectedYear }}</span>
					</div>
				</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
			</v-toolbar>
		</v-card-title>
		<v-card-text>
			<v-form ref="formReporte202">
				<v-row dense>
					<v-col cols="12" sm="6" md="4">
						<v-select
							dense
							outlined
							label="Año *"
							:items="opcionesAnios"
							:rules="[rules.obligatorio]"
							v-model="selectedYear"
							@change="actualizarTrimestres"
						/>
					</v-col>
					<v-col cols="12" sm="6" md="4">
						<v-select
							dense
							outlined
							label="Trimestre *"
							:items="opcionesTrimestre"
							item-text="text"
							:rules="[rules.obligatorio]"
							return-object
							v-model="formReporte.fechas"
						/>
					</v-col>
					<v-col cols="12" sm="6" md="4">
						<v-select dense outlined label="Entidad *" :items="opcionesEntidades"
								  :rules="[rules.obligatorio]"
								  :loading="loading.opcionesEntidades" item-text="nombre" item-value="id"
								  v-model="formReporte.entidad"/>
					</v-col>
					<v-col cols="12" sm="12" md="12">
						<v-divider/>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="primary" small dark @click="generarReporte">Generar Reporte TXT</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import {mapActions} from "vuex";
import {convertirJsonAMatriz, crearTXT} from "@/utils/excel.js";

export default {
	data() {
		const currentYear = new Date().getFullYear();
		return {
			loading: {
				opcionesEntidades: false
			},
			selectedYear: currentYear,
			opcionesAnios: Array.from({length: 2}, (_, i) => currentYear - i),
			opcionesTrimestre: [],
			opcionesEntidades: [],
			rules: {
				obligatorio: value => !!value || "Este campo es obligatorio."
			},
			formReporte: {
				fechas: null,
				entidad: null
			},
			datosReporte: []
		};
	},
	mounted() {
		this.listarOpcionesEntidades();
		this.actualizarTrimestres();
	},
	methods: {
		...mapActions("app", ["setPreload"]),

		actualizarTrimestres() {
			this.opcionesTrimestre = [
				{
					text: `Trimestre Enero - Marzo`,
					p_fecha_inicio: `${this.selectedYear}-01-01`,
					p_fecha_fin: `${this.selectedYear}-03-31`
				},
				{
					text: `Trimestre Abril - Junio`,
					p_fecha_inicio: `${this.selectedYear}-04-01`,
					p_fecha_fin: `${this.selectedYear}-06-30`
				},
				{
					text: `Trimestre Julio - Septiembre`,
					p_fecha_inicio: `${this.selectedYear}-07-01`,
					p_fecha_fin: `${this.selectedYear}-09-30`
				},
				{
					text: `Trimestre Octubre - Diciembre`,
					p_fecha_inicio: `${this.selectedYear}-10-01`,
					p_fecha_fin: `${this.selectedYear}-12-31`
				}
			];
		},

		async listarOpcionesEntidades() {
			try {
				this.loading.opcionesEntidades = true;
				const response = await this.$axios.get("/entidad/listar");
				const idsEntidades = [1, 3];
				this.opcionesEntidades = response.data.filter(entidad => idsEntidades.includes(entidad.id));
			} catch (error) {
				this.$toast.error("Ocurrió un error al listar las entidades");
			} finally {
				this.loading.opcionesEntidades = false;
			}
		},

		async generarReporte() {
			if (!this.$refs.formReporte202.validate()) return;

			try {
				const data = {
					p_fecha_inicio: this.formReporte.fechas.p_fecha_inicio,
					p_fecha_fin: this.formReporte.fechas.p_fecha_fin,
					entidad: this.formReporte.entidad
				};

				const url = "https://reportes.horus-health.com/reporte/reporte-202?token=aS0CPpHixeJbda60EHXF1BLEc2cmB4P29AEgbi2dV1WAjgPb7UDMSjN0UJhQuZ4ixZHjekHhq0LW3czwPt1B1t4JJNHLfeZujyCA";
				// const url = "http://localhost:8001/reporte/reporte-202?token=aS0CPpHixeJbda60EHXF1BLEc2cmB4P29AEgbi2dV1WAjgPb7UDMSjN0UJhQuZ4ixZHjekHhq0LW3czwPt1B1t4JJNHLfeZujyCA";

				this.setPreload(true);

				const response = await this.$axios.post(url, data);

				if (!response.data || response.data.length === 0) {
					this.$toast.error("No hay datos disponibles para generar el reporte.");
					return;
				}

				this.datosReporte = response.data;

				// Convertir JSON a matriz
				let matrizDatos = convertirJsonAMatriz(this.datosReporte);

				// Eliminar la primera fila (encabezado)
				matrizDatos = matrizDatos.slice(1);

				// Generar TXT sin encabezado
				crearTXT(matrizDatos, "reporte-202.txt");

				this.$toast.success("Reporte TXT generado exitosamente.");

				this.limpiarFormulario();

			} catch (error) {
				this.$toast.error("Ocurrió un error al generar el reporte.");
				console.error(error);
			} finally {
				this.setPreload(false);
			}
		},

		limpiarFormulario() {
			this.formReporte = {
				fechas: null,
				entidad: null
			};
			this.$refs.formReporte202.resetValidation();
		}
	}
};
</script>
