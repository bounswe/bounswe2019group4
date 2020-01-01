package com.example.arken.fragment.article

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.text.InputType
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.DialogFragment
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.AnnoCreateRequest
import com.example.arken.model.Annotation
import com.example.arken.util.AnnotationRetroClient
import kotlinx.android.synthetic.main.fragment_start.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

//burada da menuyü kullanalım on long press olduğunda

class ImageAnnotationDialogFragment(val articleId: String, val mode: Int, val photoId: Int) : DialogFragment(){

    lateinit var imageView: ImageView
    var userCookie = ""
    var annotationIcons: MutableList<ImageView> = mutableListOf()
    var annotations: MutableList<Annotation> = mutableListOf()
    lateinit var relativeLayout: RelativeLayout
    lateinit var relativeEdit: RelativeLayout
    lateinit var editText: EditText
    lateinit var checkBox: CheckBox
    var annotation: Annotation? = null
    var icon:ImageView? = null
    lateinit var deleteButton: ImageView
    lateinit var usernameText: TextView
    var realId = ""
    var updating = false
    var annoCreateRequest:AnnoCreateRequest? = null

    @SuppressLint("RestrictedApi", "ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.dialog_see_image_annotations, container)
        imageView = rootView.findViewById(R.id.annotation_image)
        relativeEdit = rootView.findViewById(R.id.annotation_edit_layout)
        checkBox = rootView.findViewById(R.id.annotation_add_check)
        editText  = relativeEdit.findViewById(R.id.annotation_editText)
        deleteButton = relativeEdit.findViewById(R.id.delete_annotation)
        usernameText= relativeEdit.findViewById(R.id.annotation_username)
        val imageIds = arrayOf(R.drawable.image1, R.drawable.image2, R.drawable.image3, R.drawable.image4,
            R.drawable.image5, R.drawable.image6, R.drawable.image7, R.drawable.image8,
            R.drawable.image9, R.drawable.image10)
        imageView.setImageResource(imageIds[photoId - 1])
        if(mode == 1){
            getAnnotations()
            relativeEdit.visibility = View.GONE
        }

        realId = activity!!.getSharedPreferences(LoginFragment.MY_PREFS_NAME, Context.MODE_PRIVATE)
            .getString("userId", "defaultId")!!
        checkBox.setOnClickListener{
            if(annotation!= null){
                //create anntoation
                val builder = AlertDialog.Builder(context!!)

                // Set the alert dialog title
                builder.setTitle("Make annotation")

                // Display a message on alert dialog
                builder.setMessage("Do your want to create that annotation?")

                // Set a positive button and its click listener on alert dialog
                builder.setPositiveButton("YES"){dialog, which ->
                    // create anno
                    val prefs = activity!!.getSharedPreferences(
                        LoginFragment.MY_PREFS_NAME,
                        Context.MODE_PRIVATE
                    )
                    annotation!!.type="Image"
                    annotation!!.articleId = articleId
                    annotation!!.annotationText = editText.text.toString()
                    annotation!!.userId = realId
                    annotation!!.username=prefs.getString("annotation_username",null)

                    val call: Call<ResponseBody> = AnnotationRetroClient.getInstance().annotationAPIService.createAnnotation(activity!!.getSharedPreferences(
                        LoginFragment.MY_PREFS_NAME,
                        Context.MODE_PRIVATE).getString("user_cookie",null),
                        AnnoCreateRequest(
                            "http://www.w3.org/ns/anno.jsonld",
                            "Annotation",
                            annotation!!,
                            "http://www.example.com/index.htm",
                            articleId,
                            null
                        )
                    )

                    call.enqueue(object : Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                            if (response.isSuccessful) {
                                editText.text.clear()
                                checkBox.isChecked = false
                                dismiss()

                            }
                        }

                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        }
                    })

                }
                // Display a negative button on alert dialog
                builder.setNegativeButton("No"){dialog,which ->

                }

                val dialog: AlertDialog = builder.create()

                dialog.show()

            }
            else{
                if(editText.text.toString() != annotation?.annotationText){
                    annotation?.annotationText = editText.text.toString()
                    val call: Call<ResponseBody> = AnnotationRetroClient.getInstance().annotationAPIService.updateAnnotation(activity!!.getSharedPreferences(
                        LoginFragment.MY_PREFS_NAME,
                        Context.MODE_PRIVATE).getString("user_cookie", "defaultCookie"),
                        AnnoCreateRequest(
                            "http://www.w3.org/ns/anno.jsonld",
                            "Annotation",
                            annotation!!,
                            "http://www.example.com/index.htm",
                            articleId,
                        null
                        ))


                    call.enqueue(object : Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                            if (response.isSuccessful) {
                                showAnnotations()

                            }
                        }

                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        }
                    })
                }
            }
        }
        deleteButton.setOnClickListener{
            if(mode == 0 && !updating){
                editText.text.clear()
                editText.layoutParams.width = 300
                editText.layoutParams.height = 200
                relativeEdit.requestLayout()
                relativeEdit.visibility = View.GONE
                relativeLayout.removeView(icon)
                usernameText.visibility = View.GONE
            }
            else if(updating){
                val call: Call<ResponseBody> = AnnotationRetroClient.getInstance().annotationAPIService.deleteAnnotation(activity!!.getSharedPreferences(
                    LoginFragment.MY_PREFS_NAME,
                    Context.MODE_PRIVATE).getString("user_cookie", "defaultCookie"), annoCreateRequest?.eTag)


                call.enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                        if (response.isSuccessful) {
                            showAnnotations()

                        }
                    }

                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    }
                })
            }
        }

        relativeLayout = rootView as RelativeLayout

        userCookie  = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        ).getString("user_cookie", "")!!

        imageView.setOnTouchListener { view, motionEvent ->
            when (motionEvent.action) {
                MotionEvent.ACTION_DOWN -> {
                    if(mode == 0){
                        annotation = Annotation()
                        annotation!!.x = ((motionEvent.x - imageView.x) / imageView.width).toDouble()
                        annotation!!.y = ((motionEvent.y - imageView.y)/ imageView.height).toDouble()
                        val lp = RelativeLayout.LayoutParams(50, 50)
                        if(icon!= null){
                            relativeLayout.removeView(icon)
                        }
                        icon= ImageView(context) // initialize ImageView
                        icon?.layoutParams = lp
                        // imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
                        icon?.setImageResource(R.drawable.ic_annotation)
                        icon?.scaleType = ImageView.ScaleType.FIT_XY
                        icon?.x = motionEvent.x - 50
                        icon?.y = motionEvent.y - 50
                        relativeLayout.addView(icon)
                        relativeEdit.x = motionEvent.x
                        relativeEdit.y = motionEvent.y
                        editText.layoutParams.width = 300
                        editText.layoutParams.height = 200
                        editText.text.clear()
                        relativeEdit.requestLayout()
                        relativeEdit.visibility = View.VISIBLE
                    }
                    if(mode == 1){
                        relativeEdit.visibility = View.GONE
                    }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if(mode== 0 && annotation!= null){
                        annotation!!.w = (editText.width.toDouble() / imageView.width)
                        annotation!!.h = (editText.height.toDouble() / imageView.height)
                    }
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    if(mode == 0 && annotation!=null ){
                        val placeX = ((motionEvent.x - imageView.x) / imageView.width).toDouble()
                        val placeY = ((motionEvent.y - imageView.y) / imageView.height).toDouble()
                        if(placeX > annotation!!.x && placeY > annotation!!.y ){
                            val lp = RelativeLayout.LayoutParams(((placeX - annotation!!.x) * imageView.width).toInt(), ((placeY - annotation!!.y) * imageView.height).toInt())
                            editText.layoutParams = lp
                            relativeLayout.requestLayout()
                        }
                    }
                    true
                }
                else -> false
            }
        }

        return rootView
    }
    fun getAnnotations(){
        val call: Call<List<AnnoCreateRequest>> = AnnotationRetroClient.getInstance().annotationAPIService.getAnnotations(activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE).getString("user_cookie", "defaultCookie"), articleId)


        call.enqueue(object : Callback<List<AnnoCreateRequest>> {
            override fun onResponse(call: Call<List<AnnoCreateRequest>>, response: Response<List<AnnoCreateRequest>>) {
                if (response.isSuccessful) {
                    val arr = response.body()
                    annotations.clear()
                    if (arr != null) {
                        for(anno in arr){
                            annotations.add(anno.body)
                        }
                        showAnnotations()
                    }

                }
            }

            override fun onFailure(call: Call<List<AnnoCreateRequest>>, t: Throwable) {
            }
        })
    }

    fun showAnnotations(){
        for(icon in annotationIcons){
            relativeLayout.removeView(icon)
        }
        annotationIcons.clear()
        for(annotation in annotations){
            if(annotation.type == "Image"){
                val lp = RelativeLayout.LayoutParams(50, 50)
                val icon = ImageView(context) // initialize ImageView
                icon.layoutParams = lp
                icon.setImageResource(R.drawable.ic_annotation)
                icon.x = (imageView.x + (annotation.x * imageView.width)).toFloat()
                icon.y = (imageView.y + (annotation.y * imageView.height)).toFloat()
                annotationIcons.add(icon)
                icon.setOnClickListener {
                    relativeEdit.x = icon.x
                    relativeEdit.y = icon.y
                    editText.layoutParams.width = (annotation.w * imageView.width).toInt()
                    editText.layoutParams.height = (annotation.h * imageView.height).toInt()
                    editText.setText(annotation.annotationText)
                    if(realId != annotation.userId) {
                        usernameText.text = "Author: " + annotation.username
                        usernameText.visibility = View.VISIBLE
                        editText.inputType = InputType.TYPE_NULL
                        checkBox.visibility = View.GONE
                        deleteButton.visibility = View.GONE
                        updating = false
                    }
                    else{
                        var anno = annotation
                        val call: Call<AnnoCreateRequest> = AnnotationRetroClient.getInstance().annotationAPIService.getAnnotation(activity!!.getSharedPreferences(
                            LoginFragment.MY_PREFS_NAME,
                            Context.MODE_PRIVATE).getString("user_cookie", "defaultCookie"), annotation.id)


                        call.enqueue(object : Callback<AnnoCreateRequest> {
                            override fun onResponse(call: Call<AnnoCreateRequest>, response: Response<AnnoCreateRequest>) {
                                if (response.isSuccessful) {
                                    updating = true
                                    anno = response.body()?.body!!
                                    annoCreateRequest = response.body()
                                    usernameText.visibility = View.GONE
                                    editText.inputType = InputType.TYPE_CLASS_TEXT
                                    checkBox.visibility = View.VISIBLE
                                    deleteButton.visibility = View.GONE

                                }else{
                                    usernameText.visibility = View.GONE
                                    checkBox.visibility = View.GONE
                                    deleteButton.visibility = View.GONE

                                }
                            }

                            override fun onFailure(call: Call<AnnoCreateRequest>, t: Throwable) {
                            }
                        })

                        this.annotation = anno

                    }

                    relativeEdit.requestLayout()
                    relativeEdit.visibility = View.VISIBLE
                }
            }
        }
        for(icon in annotationIcons){
            relativeLayout.addView(icon)
        }
    }
}