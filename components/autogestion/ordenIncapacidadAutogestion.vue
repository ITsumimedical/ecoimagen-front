<template>
	<div>
		<v-row dense class="mt-2">
			<v-col cols="12" sm="11" md="11">
				<v-text-field label="Buscar..." dense hint="Ingrese el número de la orden" append-icon="mdi-close"
					@click:append="limpiarFiltro()" outlined v-model="filtro.numeroOrdenIncapacidad"
					@keyup.enter="buscarOrdenesIncapacidad()"></v-text-field>
			</v-col>
			<v-col cols="12" sm="1" md="1">
				<v-btn color="primary" dark style="width: 100%" @click="buscarOrdenesIncapacidad()"
					:loading="loading.tablaIncapacidades">
					Buscar
				</v-btn>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-data-table dense :headers="headersOrdenesIncapacidad" :items="ordenesIncapacidad"
					loading-text="Cargando... Por favor espere" :loading="loading.tablaIncapacidades"
					no-data-text="Señor(a) afiliado(a), usted no posee ordenes de incapacidad" hide-default-footer
					disable-pagination>
					<template v-slot:[`item.estadoIncapacidad`]="{ item }">
						<v-chip small dark color="success">
							{{ parseInt(item.estado_id) === 1 ? "Activa" : "Inactiva" }}
						</v-chip>
					</template>
					<template v-slot:[`item.dosificacion`]="{ item }">
						<td>
							Tomar {{ item.dosis }} {{ item.unidad_presentacion }} Cada
							{{ item.frecuencia }} {{ item.unidad_tiempo }}
						</td>
					</template>
					<template v-slot:[`item.acciones`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn icon color="info" v-on="on" @click="imprimirOrden(item)">
									<v-icon>mdi-file-download-outline</v-icon>
								</v-btn>
							</template>
							<span>Descargar</span>
						</v-tooltip>
					</template>
				</v-data-table>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12" sm="11" md="11">
				<v-pagination v-model="paginacion.pagina" :length="Math.ceil(paginacion.total / paginacion.cantidad)"
					@input="buscarOrdenesIncapacidad" :total-visible="9"></v-pagination>
			</v-col>
			<v-col cols="12" sm="1" md="1">
				<v-select :items="[10, 20, 50]" label="Items por página" dense outlined v-model="paginacion.cantidad"
					@change="buscarOrdenesIncapacidad"></v-select>
			</v-col>
		</v-row>
	</div>
</template>
<script>
	import {
		mapActions
	} from "vuex";

	export default {
		data() {
			return {
				loading: {
					tablaIncapacidades: false,
				},
				filtro: {
					numeroOrdenIncapacidad: null,
				},
				headersOrdenesIncapacidad: [{
						text: "N° Orden",
						value: "id",
						align: "center"
					},
					{
						text: "Días de Incapacidad",
						value: "dias",
						align: "center"
					},
					{
						text: "Tipo de Incapacidad",
						value: "contingencia",
						align: "center"
					},
					{
						text: "Fecha Inicial",
						value: "fecha_inicio",
						align: "center"
					},
					{
						text: "Fecha Final",
						value: "fecha_final",
						align: "center"
					},
					{
						text: "Institución Educativa",
						value: "colegio.nombre",
						align: "center",
					},
					{
						text: "Estado",
						value: "estadoIncapacidad",
						align: "center"
					},
					{
						text: "Acciones",
						value: "acciones",
						sortable: false,
						align: "center",
					},
				],
				ordenesIncapacidad: [],
				paginacion: {
					pagina: 1,
					cantidad: 10,
					total: 0,
				},
			};
		},

		mounted() {
			this.buscarOrdenesIncapacidad();
		},
		methods: {
			...mapActions("app", ["setPreload"]),

			buscarOrdenesIncapacidad() {
				this.loading.tablaIncapacidades = true;
				const params = {
					page: this.paginacion.pagina,
					cant: this.paginacion.cantidad,
					numeroOrden: this.filtro.numeroOrdenIncapacidad,
				};
				this.$axios
					.post("/incapacidades/ordenesIncapacidadAfiliado", params)
					.then((res) => {
						this.ordenesIncapacidad = res.data.data;
						this.paginacion.total = res.data.total;
					})
					.catch(() => {
						this.$toast.error("Error al obtener las ordenes de incapacidades");
					})
					.finally(() => {
						this.loading.tablaIncapacidades = false;
					});
			},

			imprimirOrden(item) {
				this.setPreload(true);
				const data = {
					incapacidad_id: item.id,
					tipo: "incapacidad",
				};

				this.$axios
					.post("pdf", data, {
						responseType: "arraybuffer",
					})
					.then((res) => {
						const blob = new Blob([res.data], {
							type: "application/pdf",
						});
						const link = document.createElement("a");
						link.href = window.URL.createObjectURL(blob);
						window.open(link.href, "_blank");
					})
					.catch(() => {
						this.$swal({
							title: "Error",
							text: "No se pudo generar el PDF de la incapacidad",
							type: "error",
						});
					})
					.finally(() => {
						this.setPreload(false);
					});
			},

			limpiarFiltro() {
				this.filtro = {
					numeroOrdenIncapacidad: null,
				};
				this.buscarOrdenesIncapacidad();
			},
		},
	};

</script>
