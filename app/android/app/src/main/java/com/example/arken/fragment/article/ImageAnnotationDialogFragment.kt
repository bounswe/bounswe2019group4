package com.example.arken.fragment.article

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.DialogFragment
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.Annotation
import com.example.arken.util.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.annotation.SuppressLint
import android.text.InputType
import android.view.MotionEvent
import android.widget.RelativeLayout
import androidx.appcompat.app.AlertDialog
import com.example.arken.model.AnnoCreateRequest
import okhttp3.ResponseBody

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
        editText  = rootView.findViewById(R.id.annotation_editText)
        deleteButton = rootView.findViewById(R.id.delete_annotation)
        val imageIds = arrayOf(R.drawable.image1, R.drawable.image2, R.drawable.image3, R.drawable.image4,
            R.drawable.image5, R.drawable.image6, R.drawable.image7, R.drawable.image8,
            R.drawable.image9, R.drawable.image10)
        imageView.setImageResource(imageIds[photoId - 1])
        if(mode == 1){
            getAnnotations()
            relativeEdit.visibility = View.GONE
        }
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
                    val realId = activity!!.getSharedPreferences(LoginFragment.MY_PREFS_NAME, Context.MODE_PRIVATE)
                        .getString("userId", "defaultId")
                    // create anno
                    annotation!!.type="image"
                    annotation!!.articleId = articleId
                    annotation!!.annotationText = editText.text.toString()
                    annotation!!.userId = realId

                    val call: Call<ResponseBody> = AnnotationRetroClient.getInstance().annotationAPIService.createAnnotation(activity!!.getSharedPreferences(
                        LoginFragment.MY_PREFS_NAME,
                        Context.MODE_PRIVATE).getString("user_cookie",null),
                        AnnoCreateRequest(
                            "http://www.w3.org/ns/anno.jsonld",
                            "Annotation",
                            annotation!!,
                            "http://www.example.com/index.htm",
                            articleId
                        )
                    )

                    call.enqueue(object : Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                            if (response.isSuccessful) {
                                editText.text.clear()
                                checkBox.isChecked = false
                                dismiss()

                            } else {
                                Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                            }
                        }

                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                            Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                        }
                    })

                }
                // Display a negative button on alert dialog
                builder.setNegativeButton("No"){dialog,which ->

                }

                val dialog: AlertDialog = builder.create()

                dialog.show()

            }
        }
        deleteButton.setOnClickListener{
            if(mode == 0){
                editText.text.clear()
                editText.layoutParams.width = 100
                editText.layoutParams.height = 50
                relativeEdit.requestLayout()
                relativeEdit.visibility = View.GONE
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
                        annotation!!.x = ((motionEvent.rawX - imageView.x) / imageView.width).toDouble()
                        annotation!!.y = ((motionEvent.rawY - imageView.y)/ imageView.height).toDouble()
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
                        editText.layoutParams.width = 100
                        editText.layoutParams.height = 50
                        editText.text.clear()
                        relativeEdit.requestLayout()
                        relativeEdit.visibility = View.VISIBLE
                    }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if(mode== 0 && annotation!= null){
                        val placeX = ((motionEvent.rawX - imageView.x) / imageView.width).toDouble()
                        val placeY = ((motionEvent.rawY - imageView.y) / imageView.height).toDouble()
                        annotation!!.w = (placeX - annotation!!.x)
                        annotation!!.h = (placeY - annotation!!.y)
                    }
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    if(mode == 0 && annotation!=null ){
                        val placeX = ((motionEvent.rawX - imageView.x) / imageView.width).toDouble()
                        val placeY = ((motionEvent.rawY - imageView.y) / imageView.height).toDouble()
                        if(placeX > annotation!!.x && placeY > annotation!!.y){
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

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<AnnoCreateRequest>>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    fun showAnnotations(){
        for(icon in annotationIcons){
            relativeLayout.removeView(icon)
        }
        annotationIcons.clear()
        for(annotation in annotations){
            if(annotation.type == "image"){
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
                    editText.inputType = InputType.TYPE_NULL
                    relativeEdit.requestLayout()
                    relativeEdit.visibility = View.VISIBLE
                }
                // imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);

            }
        }
        for(icon in annotationIcons){
            relativeLayout.addView(icon)
        }
    }
}