import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { TiendaService } from 'src/app/core/tienda/tienda.service';
import { UsuarioService } from 'src/app/core/usuario/usuario.service';
import { Producto } from 'src/app/models/producto';
import { Tienda } from 'src/app/models/tienda';
import { environment } from 'src/environments/environment';
import { DinamicRating, DinamicReviews, Tooltip, Rating, Sweetalert, Capitalize, CreateUrl } from '../../../functions';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-cuenta-mi-tienda',
  templateUrl: './cuenta-mi-tienda.component.html',
  styleUrls: ['./cuenta-mi-tienda.component.css']
})
export class CuentaMiTiendaComponent implements OnInit, OnDestroy {
  @Input() usuario: string;
  server: string = environment.server;
  serverDelete: string = environment.serverDelete;
  path: string = environment.url_image;
  es_vendedor: boolean = false;
  preload: boolean = false;
  store: Array<any> = [];
  products: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  loadProduct: number = 0;
  render: boolean = false;
  renderReview: boolean = false;
  loadReview: number = 0;
  totalReviews: any[] = [];
  storeModel: Tienda;
  idStore: string = null;
  logoStore: File = null;
  coverStore: File = null;
  imageProduct: File = null;
  defaultBannerImg: File = null;
  hSliderImg: File = null;
  hSlider: object = {

    "H4 tag": "",
    "H3-1 tag": "",
    "H3-2 tag": "",
    "H3-3 tag": "",
    "H3-4s tag": "",
    "Button tag": "",
    "IMG tag": ""
  }
  social: object = {

    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: ""

  }
  productModel: Producto;
  /*=============================================
   Configuración inicial de Summernote 
   =============================================*/

  config = {

    placeholder: '',
    tabsize: 2,
    height: '400px',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['link', 'picture', 'hr']]
    ]

  }
  categories: any[] = [];
  subcategories: any[] = [];
  summaryGroup: any[] = [{

    input: ''

  }]
  tags: any[] = [];
  gallery: File[] = [];
  editGallery: any[] = [];
  deleteGallery: any[] = [];
  video: any[] = [];
  offer: any[] = [];
  idProducts: any[] = [];
  idProduct: string = null;
  editProductAction: boolean = false;
  popoverMessage: string = 'Estas seguro de eliminar el producto?';
  constructor(
    private tiendaService: TiendaService,
    private productsService: ProductoService,
    private usersService: UsuarioService,
    private categoriesService: CategoriaService,
    private subCategoriesService: SubcategoriaService,
    private http: HttpClient
  ) {
    this.storeModel = new Tienda();
    this.productModel = new Producto();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    }
    this.tiendaService.getFilterData("username", this.usuario).subscribe(respTienda => {
      if (Object.keys(respTienda).length == 0) {
        window.open('cuenta-usuario/cuenta/nueva-tienda', '_top')
      } else {
        this.es_vendedor = true;
        for (const i in respTienda) {

          this.idStore = Object.keys(respTienda).toString();

          this.store.push(respTienda[i]);

          /*=============================================
          Almacenamos información de la tienda en el modelo
          =============================================*/

          this.storeModel.tienda = respTienda[i].tienda;
          this.storeModel.url = respTienda[i].url;
          this.storeModel.acerca_de = respTienda[i].acerca_de;
          this.storeModel.resumen = respTienda[i].resumen;
          this.storeModel.email = respTienda[i].email;
          this.storeModel.direccion = respTienda[i].direccion;
          this.storeModel.logo = respTienda[i].logo;
          this.storeModel.cover = respTienda[i].cover;
          this.storeModel.username = respTienda[i].username;
          this.storeModel.telefono = respTienda[i].telefono;


        }

        this.store.map((item, index) => {
          item.social = JSON.parse(item.social);

          item.newSocial = [];

          for (const i in item.social) {

            if (item.social[i] != "") {

              item.newSocial.push(i)
            }

            /*=============================================
            Capturamos el destino final de cada red social
            =============================================*/

            switch (i) {

              case "facebook":
                this.social["facebook"] = item.social[i].split("/").pop();
                break;

              case "instagram":
                this.social["instagram"] = item.social[i].split("/").pop();
                break;

              case "twitter":
                this.social["twitter"] = item.social[i].split("/").pop();
                break;

              case "linkedin":
                this.social["linkedin"] = item.social[i].split("/").pop();
                break;

              case "youtube":
                this.social["youtube"] = item.social[i].split("/").pop();
                break;

            }

          }

          return item;
        });

        console.log("tienda:", this.store);
        console.log("social:", this.social['instagram']);
        console.log("social_twitter:", this.social['twitter']);


        this.productsService.getFilterDataStore("tienda", this.store[0].tienda).subscribe(resp => {
          console.log("productos:", resp);
          for (const i in resp) {
            this.products.push(resp[i]);
            this.idProducts = Object.keys(resp).toString().split(",");
            this.loadProduct++;
          }

          this.products.map((product, index) => {
            product.feedback = JSON.parse(product.feedback);
            product.galeria = JSON.parse(product.galeria);
            product.horizontal_slider = JSON.parse(product.horizontal_slider);
            product.resumen = JSON.parse(product.resumen);
            product.etiquetas = JSON.parse(product.etiquetas);

            if (product.oferta != '') {
              product.oferta = JSON.parse(product.oferta);
            } else {
              product.oferta = [];
            }
            this.totalReviews.push(JSON.parse(product.reviews));

            let rating = DinamicRating.fnc(product);
            product.reviews = DinamicReviews.fnc(rating);

            return product;

          });
          // console.log("total_review:",this.totalReviews.length);
          if (this.loadProduct == this.products.length) {
            this.dtTrigger.next();
          }
        });

        /*=============================================
                Traer data de categorías
                =============================================*/

        this.categoriesService.getAll()
          .subscribe(resp => {

            for (const i in resp) {

              this.categories.push(resp[i]);
            }

          })

        this.preload = true;
      }
    });
  }

  callback(i, totalReviews) {
    if (!this.render) {
      this.render = true;
      let globalRating = 0;
      let globalReviews = 0;
      setTimeout(function () {
        Tooltip.fnc();
        $("table").animate({ "opacity": 1 });
        $(".preloadTable").animate({ "opacity": 0 });
        /*=============================================
              Agregamos las calificaciones totales de la tienda
              =============================================*/

        totalReviews.forEach((review, index) => {

          globalRating += review.length;

          for (const i in review) {

            globalReviews += review[i].review

          }
        })
        console.log("globalRating:", globalRating);
        console.log("globalReviews:", globalReviews);
        //numero de estrellas del 1 al 5 
        let averageReviews = Math.round(globalReviews / globalRating);
        //Porcentaje de calificación de la tienda del 1 al 100%
        let porcentaje;
        if (globalReviews != 0 && globalRating != 0) {
          porcentaje = Math.round(globalReviews * 100 / (globalRating * 5));

        } else {
          porcentaje = 0;
        }

        /*=============================================
        Pintamos en el HTML el promedio y porcentaje de calificaciones
        =============================================*/
        $(".globalRating").html(globalRating);
        $(".porcentaje").html(porcentaje);
        /*=============================================
        Tomamos el Arreglo del promedio de calificaciones
        =============================================*/
        let averageRating = DinamicReviews.fnc(averageReviews);

        /*=============================================
              Pintamos en el HTML el Select para el plugin Rating
              =============================================*/

        $(".br-theme-fontawesome-stars").html(`

					 <select class="ps-rating reviewsOption" data-read-only="true"></select>

            	`)

        /*=============================================
        Recorremos el arreglo del promedio de calificaciones para pintar los options
        =============================================*/

        for (let i = 0; i < averageRating.length; i++) {

          $(".reviewsOption").append(`

						 <option value="${averageRating[i]}">${i + 1}</option>

            		`)

        }

        /*=============================================
        Ejecutamos la función Rating()
        =============================================*/

        Rating.fnc();

      }, i * 100);
    }
  }

  callbackReview() {

    this.loadReview++


    if (this.loadReview > this.loadProduct) {

      if (!this.renderReview) {

        this.renderReview = true;

        Rating.fnc();

      }

    }
  }

  validate(input) {

    /*=============================================
      Validamos la información de la tienda
      =============================================*/

    if ($(input).attr("name") == "storeAbout") {

      /*=============================================
        Validamos expresión regular de la información de la tienda
        =============================================*/

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      } else {

        this.storeModel.resumen = input.value.substr(0, 100) + "...";
      }

    }

    /*=============================================
    Validamos el teléfono de la tienda
    =============================================*/

    if ($(input).attr("name") == "storePhone") {

      /*=============================================
      Validamos expresión regular del teléfono de la tienda
      =============================================*/

      let pattern = /^[-\\0-9 ]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos la dirección de la tienda
    =============================================*/

    if ($(input).attr("name") == "storeAddress") {

      /*=============================================
      Validamos expresión regular de la dirección de la tienda
      =============================================*/

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos las redes sociales de la tienda
    =============================================*/

    if ($(input).attr("social") == "socialNetwork") {

      /*=============================================
      Validamos expresión regular de la dirección de la tienda
      =============================================*/

      let pattern = /^[-\\_\\.\\0-9a-zA-Z]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        // input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos el nombre del producto
    =============================================*/

    if ($(input).attr("name") == "productName") {

      /*=============================================
     Validamos expresión regular del nombre de la tienda
     =============================================*/

      let pattern = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      } else {

        /*=============================================
        Validamos que el nombre del producto no esté repetido
        =============================================*/
        this.productsService.getFilterDataMyStore("nombre", input.value)
          .subscribe(resp => {

            if (Object.keys(resp).length > 0) {

              $(input).parent().addClass('was-validated');
              input.value = "";
              this.productModel.url = "";

              Sweetalert.fnc("error", "El nombre del producto ya existe", null)

              return;

            } else {

              /*=============================================
             Capitulamos el nombre del producto
             =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
              Creamos la URL del producto
              =============================================*/

              this.productModel.url = CreateUrl.fnc(input.value);

            }

          })



      }


    }

    /*=============================================
    Validamos los TAGS de los Banner's y Slider's
    =============================================*/

    if ($(input).attr("tags") == "tags") {

      /*=============================================
      Validamos expresión regular
      =============================================*/

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,50}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }


    /*=============================================
    Validamos el precio de envío y el precio de venta
    =============================================*/

    if ($(input).attr("tags") == "prices") {

      /*=============================================
      Validamos expresión regular
      =============================================*/

      let pattern = /^[.\\,\\0-9]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        return;

      }

    }

    /*=============================================
   Validamos dias de entrega y stock
   =============================================*/

    if ($(input).attr("tags") == "intNumber") {

      /*=============================================
      Validamos expresión regular
      =============================================*/

      let pattern = /^[0-9]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        return;

      } else {

        if ($(input).attr("name") == "stock" && input.value > 100) {

          input.value = "";

          Sweetalert.fnc("error", "El producto ha excedido las 100 unidades", null)

          return;

        }

      }

    }

  }

  /*=============================================
  Validación para las imágenes del formulario
  =============================================*/

  validateImage(e, tagPicture) {

    switch (tagPicture) {

      case "changeLogo":
        this.logoStore = e.target.files[0];
        break;

      case "changeCover":
        this.coverStore = e.target.files[0];
        break;

      case "changeImage":
        this.imageProduct = e.target.files[0];
        break;

      case "changeDefaultBanner":
        this.defaultBannerImg = e.target.files[0];
        break;

      case "changeHSlider":
        this.hSliderImg = e.target.files[0];
        break;


    }

    let image = e.target.files[0];

    /*=============================================
    Validamos el formato
    =============================================*/

    if (image["type"] !== "image/jpeg" && image["type"] !== "image/png") {

      Sweetalert.fnc("error", "The image must be in JPG or PNG format", null)

      return;
    }

    /*=============================================
    Validamos el tamaño
    =============================================*/

    else if (image["size"] > 2000000) {

      Sweetalert.fnc("error", "Image must not weigh more than 2MB", null)

      return;
    }

    /*=============================================
    Mostramos la imagen temporal
    =============================================*/

    else {

      let data = new FileReader();
      data.readAsDataURL(image);

      $(data).on("load", function (event) {

        let path = event.target.result;

        $(`.${tagPicture}`).attr("src", path)

      })

    }
  }

  onSubmitStore(f: NgForm) {
    console.log("submit:", f);
    /*=============================================
        Validación completa del formulario
        =============================================*/

    if (f.invalid) {

      Sweetalert.fnc("error", "Faltan campos por llenar o no cumplen el formato especificado", null);

      return;
    }

    /*=============================================
    Alerta suave mientras se edita la tienda
    =============================================*/

    Sweetalert.fnc("loading", "Loading...", null);

    /*=============================================
    Subir imagenes al servidor
    =============================================*/
    let countAllImages = 0;

    let allImages = [
      {
        type: 'logoStore',
        file: this.logoStore,
        folder: this.storeModel.url,
        path: 'stores',
        width: '270',
        height: '270'
      },
      {
        type: 'coverStore',
        file: this.coverStore,
        folder: this.storeModel.url,
        path: 'stores',
        width: '1424',
        height: '768'
      }

    ]

    for (const i in allImages) {

      const formData = new FormData();

      formData.append('file', allImages[i].file);
      formData.append('folder', allImages[i].folder);
      formData.append('path', allImages[i].path);
      formData.append('width', allImages[i].width);
      formData.append('height', allImages[i].height);

      this.http.post(this.server, formData)
        .subscribe(resp => {

          if (resp["status"] != null && resp["status"] == 200) {

            if (allImages[i].type == "logoStore") {

              /*=============================================
              Borrar antigua imagen del servidor
              =============================================*/

              const formData = new FormData();

              let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.storeModel.logo}`;

              formData.append("fileDelete", fileDelete);

              this.http.post(this.serverDelete, formData)
                .subscribe(resp => { })

              this.storeModel.logo = resp["result"];

            }

            if (allImages[i].type == "coverStore") {

              /*=============================================
             Borrar antigua imagen del servidor
             =============================================*/

              const formData = new FormData();

              let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.storeModel.cover}`;

              formData.append("fileDelete", fileDelete);

              this.http.post(this.serverDelete, formData)
                .subscribe(resp => { })

              this.storeModel.cover = resp["result"];

            }

          }

          countAllImages++;

          /*=============================================
        Preguntamos cuando termina de subir todas las imágenes
        =============================================*/

          if (countAllImages == allImages.length) {

            /*=============================================
          Consolidar número telefónico de la tienda
          =============================================*/

            this.storeModel.telefono = this.storeModel.telefono;

            /*=============================================
            Consolidar redes sociales para la tienda
            =============================================*/

            for (const i in Object.keys(this.social)) {

              if (this.social[Object.keys(this.social)[i]] != "") {

                this.social[Object.keys(this.social)[i]] = `https://${Object.keys(this.social)[i]}.com/${this.social[Object.keys(this.social)[i]]}`

              }

            }

            this.storeModel.social = JSON.stringify(this.social);

            /*=============================================
                Editar la tienda en la BD
                =============================================*/

            this.tiendaService.patchDataAuth(this.idStore, this.storeModel, localStorage.getItem("idToken")).subscribe(resp => {

              Sweetalert.fnc("success", "La información de la tienda fue actualizada", "cuenta-usuario/cuenta/mi-tienda");

            }, err => {

              Sweetalert.fnc("error", err.error.error.message, null)

            })

          }

        })

    }



  }





  /*=============================================
  Traer la data de subcategorías de acuerdo a la categoría seleccionada
  =============================================*/

  changeCategory(input) {

    let category = input.value.split("_")[0];

    this.subCategoriesService.getByFilter("categoria", category)
      .subscribe(resp => {

        this.subcategories = [];

        for (const i in resp) {

          this.subcategories.push(resp[i])
        }

      })

  }

  /*=============================================
  Adicionar Input's de forma dinámica
  =============================================*/

  addInput(type) {

    if (type == "summary") {

      if (this.summaryGroup.length < 5) {

        this.summaryGroup.push({

          input: ''
        })

      } else {

        Sweetalert.fnc("error", "Se superó el límite de entrada", null)

      }

    }

  }

  /*=============================================
  Quitar Input's de forma dinámica
  =============================================*/

  removeInput(i, type) {

    if (i > 0) {

      if (type == "summary") {

        this.summaryGroup.splice(i, 1)

      }
    }

  }

  /*=============================================
  Funciones de Dropzone
  =============================================*/

  onSelect(event) {

    this.gallery.push(...event.addedFiles);
  }

  onRemove(event) {

    this.gallery.splice(this.gallery.indexOf(event), 1);
  }

  /*=============================================
  Editar Producto
  =============================================*/

  editProduct(idProduct) {
    
    this.idProduct = idProduct;

    /*=============================================
    Alerta suave mientras se carga el formulario de edición
    =============================================*/

    Sweetalert.fnc("loading", "Cargando...", null);

    /*=============================================
    Traemos la data del producto
    =============================================*/

    this.editProductAction = true;

    this.productsService.getById(idProduct)
      .subscribe(resp => {

        this.productModel.nombre = resp["nombre"];
        this.productModel.url = resp["url"];
        this.productModel.categoria = resp["categoria"];
        this.productModel.subcategoria = resp["subcategoria"];
        this.productModel.grupo = resp["grupo"];
        this.productModel.descripcion = resp["descripcion"];
        this.productModel.vistas = resp["vistas"];
        this.productModel.ventas = resp["ventas"];
        this.productModel.imagen = resp["imagen"];
        this.productModel.default_banner = resp["default_banner"];
        this.productModel.precio = resp["precio"];
        // this.productModel.shipping = resp["shipping"];
        this.productModel.tiempo_entrega = resp["tiempo_entrega"];
        this.productModel.stock = resp["stock"];

        /*=============================================
        Cargar el resumen del producto
        =============================================*/

        this.summaryGroup = [];

        JSON.parse(resp["resumen"]).forEach(value => {

          this.summaryGroup.push({

            input: value

          })

        })


        /*=============================================
        Cargar las etiquetas del producto
        =============================================*/

        JSON.parse(resp["etiquetas"]).forEach(item => {

          this.tags.push(item)

        })

        /*=============================================
        Cargar la galería del producto
        =============================================*/
        this.editGallery = [];
        JSON.parse(resp["galeria"]).forEach(item => {

          this.editGallery.push(item)

        })


        /*=============================================
        Carga del slide horizontal del producto
        =============================================*/

        this.hSlider["H4 tag"] = JSON.parse(resp["horizontal_slider"])["H4 tag"];
        this.hSlider["H3-1 tag"] = JSON.parse(resp["horizontal_slider"])["H3-1 tag"];
        this.hSlider["H3-2 tag"] = JSON.parse(resp["horizontal_slider"])["H3-2 tag"];
        this.hSlider["H3-3 tag"] = JSON.parse(resp["horizontal_slider"])["H3-3 tag"];
        this.hSlider["H3-4s tag"] = JSON.parse(resp["horizontal_slider"])["H3-4s tag"];
        this.hSlider["Button tag"] = JSON.parse(resp["horizontal_slider"])["Button tag"];
        this.hSlider["IMG tag"] = JSON.parse(resp["horizontal_slider"])["IMG tag"];

        /*=============================================
        Carga de las ofertas del producto
        =============================================*/

        if (resp["oferta"] != "") {

          JSON.parse(resp["oferta"]).forEach(value => {

            this.offer.push(value);

          })

        }

        // console.log("oferta:", this.offer[3]);
        /*=============================================
        Abrir la ventana modal
        =============================================*/
        $("#editProduct").modal()

        /*=============================================
        Cerrar la Alerta suave
        =============================================*/

        Sweetalert.fnc("close", "", null);

      })

  }


  removeGallery(pic) {

    this.editGallery.forEach((name, index) => {

      if (pic == name) {

        this.deleteGallery.push(pic);

        this.editGallery.splice(index, 1);

      }

    })

  }

  /*=============================================
  Formulario para la creación o edición de productos
  =============================================*/

  onSubmitProduct(f: NgForm) {

    /*=============================================
    Validar que el producto esté correctamente creado
    =============================================*/

    let formProduct = $(".formProduct");

    for (let i = 0; i < formProduct.length; i++) {

      if ($(formProduct[i]).val() == "" || $(formProduct[i]).val() == undefined) {

        $(formProduct[i]).parent().addClass("was-validated")

      }
    }

    /*=============================================
    Validamos que las palabras claves tenga como mínimo una sola palabra
    =============================================*/

    if (this.tags.length == 0) {

      Sweetalert.fnc("error", "La lista de etiquetas esta vacia", null);

      return;

    }

    /*=============================================
    Validamos que la galería tenga como mínimo una sola imagen
    =============================================*/

    if (!this.editProductAction) {

      if (this.gallery.length == 0) {

        Sweetalert.fnc("error", "La galería esta vacía", null);

        return;

      }

    } else {

      if (this.editGallery.length == 0 && this.gallery.length == 0) {

        Sweetalert.fnc("error", "La galería esta vacía", null);

        return;

      }

    }

    /*=============================================
    Validación completa del formulario
    =============================================*/

    if (f.invalid) {

      Sweetalert.fnc("error", "Complete los campos obligatorios", null);

      return;
    }

    /*=============================================
    Alerta suave mientras se registra la tienda y el producto
    =============================================*/

    Sweetalert.fnc("loading", "Cargando...", null);

    /*=============================================
    Subir imagenes al servidor
    =============================================*/

    let folder = "";

    if (!this.editProductAction) {

      folder = this.productModel.categoria.split("_")[1];

    } else {

      folder = this.productModel.categoria;
    }

    let countAllImages = 0;

    let allImages = [

      {
        type: 'imageProduct',
        file: this.imageProduct,
        folder: folder,
        path: 'products/categorias',
        width: '300',
        height: '300'
      },

      {
        type: 'defaultBannerImg',
        file: this.defaultBannerImg,
        folder: `${folder}/default`,
        path: 'products/categorias',
        width: '570',
        height: '210'
      },
      {
        type: 'hSliderImg',
        file: this.hSliderImg,
        folder: `${folder}/horizontal`,
        path: 'products/categorias',
        width: '1920',
        height: '358'
      }

    ]

    for (const i in allImages) {

      const formData = new FormData();

      formData.append('file', allImages[i].file);
      formData.append('folder', allImages[i].folder);
      formData.append('path', allImages[i].path);
      formData.append('width', allImages[i].width);
      formData.append('height', allImages[i].height);

      this.http.post(this.server, formData)
        .subscribe(resp => {

          if (resp["status"] != null && resp["status"] == 200) {

            if (allImages[i].type == "imageProduct") {

              if (this.editProductAction) {

                /*=============================================
                Borrar antigua imagen del servidor
                =============================================*/

                const formData = new FormData();

                let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.productModel.imagen}`;

                formData.append("fileDelete", fileDelete);

                this.http.post(this.serverDelete, formData)
                  .subscribe(resp => { })

              }

              this.productModel.imagen = resp["result"];

            }

            if (allImages[i].type == "defaultBannerImg") {

              if (this.editProductAction) {

                /*=============================================
                Borrar antigua imagen del servidor
                =============================================*/

                const formData = new FormData();

                let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.productModel.default_banner}`;

                formData.append("fileDelete", fileDelete);

                this.http.post(this.serverDelete, formData)
                  .subscribe(resp => { })

              }

              this.productModel.default_banner = resp["result"];

            }

            if (allImages[i].type == "hSliderImg") {

              if (this.editProductAction) {

                /*=============================================
                Borrar antigua imagen del servidor
                =============================================*/

                const formData = new FormData();

                let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.hSlider["IMG tag"]}`;

                formData.append("fileDelete", fileDelete);

                this.http.post(this.serverDelete, formData)
                  .subscribe(resp => { })

              }

              this.hSlider["IMG tag"] = resp["result"];

            }
          }

          countAllImages++

          /*=============================================
          Preguntamos cuando termina de subir todas las imágenes
          =============================================*/

          if (countAllImages == allImages.length) {


            if (!this.editProductAction) {

              /*=============================================
              Consolidar fecha de creación del producto   
              =============================================*/

              this.productModel.fecha_creacion = new Date();

              /*=============================================
              Consolidar el feedback para el producto
              =============================================*/

              this.productModel.feedback = {

                type: "review",
                comment: "Tu producto esta en revisión"

              }

              this.productModel.feedback = JSON.stringify(this.productModel.feedback);


              /*=============================================
              Consolidar categoria para el producto
              =============================================*/

              this.productModel.categoria = this.productModel.categoria.split("_")[1];

              /*=============================================
              Consolidar lista de títulos para el producto
              =============================================*/

              this.productModel.grupo = this.productModel.subcategoria.split("_")[1];

              /*=============================================
              Consolidar sub-categoria para el producto
              =============================================*/

              this.productModel.subcategoria = this.productModel.subcategoria.split("_")[0];


              /*=============================================
              Consolidar el nombre de la tienda para el producto
              =============================================*/

              this.productModel.tienda = this.storeModel.tienda;

              /*=============================================
              Consolidar calificaciones para el producto
              =============================================*/

              this.productModel.reviews = "[]";

              /*=============================================
              Consolidar las ventas y las vistas del producto
              =============================================*/
              this.productModel.ventas = 0;
              this.productModel.vistas = 0;

            }


            /*=============================================
            Consolidar resumen del producto 
            =============================================*/

            let newSummary = [];

            for (const i in this.summaryGroup) {

              newSummary.push(this.summaryGroup[i].input);
              this.productModel.resumen = JSON.stringify(newSummary);

            }
            /*=============================================
             Consolidar palabras claves para el producto
            =============================================*/

            let newTags = [];

            for (const i in this.tags) {

              if (this.tags[i].value != undefined) {

                newTags.push(this.tags[i].value);

              } else {

                newTags.push(this.tags[i]);
              }

            }

            this.productModel.etiquetas = JSON.stringify(newTags).toLowerCase();


            /*=============================================
            Consolidar Horizontal Slider del producto
            =============================================*/

            this.productModel.horizontal_slider = JSON.stringify(this.hSlider);


            /*=============================================
            Consolidar Oferta
            =============================================*/

            if (this.offer.length > 0) {

              this.productModel.oferta = JSON.stringify(this.offer);

            } else {

              this.productModel.oferta = "[]";
            }

            /*=============================================
            Subir galería al servidor
            =============================================*/
            let countGallery = 0;
            let newGallery = [];

            /*=============================================
            Preguntamos si estamos subiendo nuevas imágenes a la galería
            =============================================*/

            if (this.gallery.length > 0) {

              /*=============================================
              Actualizar galería
              =============================================*/

              if (this.editProductAction) {

                /*=============================================
                Borrar Imagen de galería del servidor
                =============================================*/

                for (const i in this.deleteGallery) {

                  /*=============================================
                  Borrar antigua imagen del servidor
                  =============================================*/

                  const formData = new FormData();

                  let fileDelete = `products/categorias/${folder}/gallery/${this.deleteGallery[i]}`;

                  formData.append("fileDelete", fileDelete);

                  this.http.post(this.serverDelete, formData)
                    .subscribe(resp => { })

                }

                /*=============================================
                Agregar imagenes nuevas al array de la galería
                =============================================*/

                for (const i in this.editGallery) {

                  newGallery.push(this.editGallery[i]);
                }

              }

              /*=============================================
              Subimos imágenes nuevas de la galería al servidor
              =============================================*/

              for (const i in this.gallery) {

                const formData = new FormData();

                formData.append('file', this.gallery[i]);
                formData.append('folder', `${folder}/gallery`);
                formData.append('path', 'products/categorias');
                formData.append('width', '1000');
                formData.append('height', '1000');

                this.http.post(this.server, formData)
                  .subscribe(resp => {

                    if (resp["status"] != null && resp["status"] == 200) {

                      newGallery.push(resp["result"]);

                    }

                    countGallery++;

                    /*=============================================
                    Preguntamos cuando termina de subir toda la galería
                    =============================================*/

                    if (countGallery == this.gallery.length) {

                      /*=============================================
                      Consolidar los nombres de archivo de la galería
                      =============================================*/

                      this.productModel.galeria = JSON.stringify(newGallery);

                      if (!this.editProductAction) {

                        /*=============================================
                        Crear el producto en la BD
                        =============================================*/

                        this.productsService.registerDatabase(this.productModel, localStorage.getItem("idToken"))
                          .subscribe(resp => {

                            if (resp["name"] != "") {

                              Sweetalert.fnc("success", "El producto se ha creado correctamente", "cuenta-usuario/cuenta/mi-tienda");

                            }

                          }, err => {

                            Sweetalert.fnc("error", err.error.error.message, null)

                          })

                      } else {

                        /*=============================================
                        Editar el producto en la BD
                        =============================================*/

                        this.productsService.patchDataAuth(this.idProduct, this.productModel, localStorage.getItem("idToken"))
                          .subscribe(resp => {

                            Sweetalert.fnc("success", "El producto ha sido actualizado correctamente", "cuenta-usuario/cuenta/mi-tienda");


                          }, err => {

                            Sweetalert.fnc("error", err.error.error.message, null)

                          })


                      }


                    }


                  })

              }

            } else {

              /*=============================================
              Consolidar los nombres de archivo de la galería
              =============================================*/

              this.productModel.galeria = JSON.stringify(this.editGallery);

              /*=============================================
              Editar el producto en la BD
              =============================================*/

              this.productsService.patchDataAuth(this.idProduct, this.productModel, localStorage.getItem("idToken"))
                .subscribe(resp => {

                  Sweetalert.fnc("success", "El producto ha sido actualizado correctamente", "cuenta-usuario/cuenta/mi-tienda");


                }, err => {

                  Sweetalert.fnc("error", err.error.error.message, null)

                })

            }

          }

        })

    }

  }

  /*=============================================
   Eliminar el producto
   =============================================*/

  deleteProduct(idProduct, products, i) {

    /*=============================================
    Preguntamos si hay más de un producto para borrar
    =============================================*/

    if (products.length > 1) {

      let allImages = [];
      let countDelete = 0;

      /*=============================================
      Borramos todos los archivos del servidor relacionados con el producto
      =============================================*/

      this.products.forEach((product, index) => {

        if (i == index) {

          allImages.push(

            `products/categorias/${product.categoria}/${product.imagen}`,
            `products/categorias/${product.categoria}/default/${product.default_banner}`,
            `products/categorias${product.categoria}/horizontal/${product.horizontal_slider["IMG tag"]}`,
          )

          for (const i in product.gallery) {

            allImages.push(`products/categorias/${product.category}/gallery/${product.gallery[i]}`);

          }

          for (const i in allImages) {

            /*=============================================
            Borrar todas las imagenes del servidor
            =============================================*/

            const formData = new FormData();

            formData.append("fileDelete", allImages[i]);

            this.http.post(this.serverDelete, formData)
              .subscribe(resp => {

                if (resp["status"] == 200) {

                  countDelete++;

                  if (countDelete == allImages.length) {

                    this.productsService.deleteDataAuth(idProduct, localStorage.getItem("idToken"))
                      .subscribe(resp => {

                        Sweetalert.fnc("success", "El producto ha sido eliminado", "cuenta-usuario/cuenta/mi-tienda");
                      }, err => {

                        Sweetalert.fnc("error", err.error.error.message, null)

                      })

                  }

                }

              })

          }

        }

      })


    } else {

      Sweetalert.fnc("error", "No puedes eliminar el único producto", null)

    }

  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
