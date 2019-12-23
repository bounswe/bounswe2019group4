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
import com.example.arken.model.ListAnnotations
import com.example.arken.model.Annotation
import com.example.arken.util.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.annotation.SuppressLint
import android.view.MotionEvent
import android.widget.RelativeLayout

//burada da menuyü kullanalım on long press olduğunda

class ImageAnnotationDialogFragment(val articleId: String, val mode: Int) : DialogFragment(){

    lateinit var imageView: ImageView
    var userCookie = ""
    var annotationIcons: MutableList<ImageView> = mutableListOf()
    var annotations: MutableList<Annotation> = mutableListOf()
    lateinit var relativeLayout: RelativeLayout
    lateinit var linearLayout: LinearLayout
    lateinit var editText: EditText
    lateinit var checkBox: CheckBox
    var annotation: Annotation? = null

    @SuppressLint("RestrictedApi", "ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.dialog_see_image_annotations, container)
        imageView = rootView.findViewById(R.id.annotation_image)
        linearLayout = rootView.findViewById(R.id.annotation_edit_layout)
        checkBox = rootView.findViewById(R.id.annotation_add_check)
        editText  = rootView.findViewById(R.id.annotation_editText)
        if(mode == 1){
            showAnnotations()
            linearLayout.visibility = View.GONE
        }
        checkBox.setOnClickListener{
            if(annotation!= null){
                //create anntoation
                editText.text.clear()
                relativeLayout.visibility = View.GONE
                checkBox.isChecked = false
            }
        }

        relativeLayout = rootView.findViewById(R.id.annotation_background)

        this.dialog?.setTitle("Add Alert")
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
                        val lp = RelativeLayout.LayoutParams(30, 30)
                        lp.addRule(RelativeLayout.CENTER_IN_PARENT)
                        val icon = ImageView(context) // initialize ImageView
                        icon.layoutParams = lp
                        // imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
                        icon.setImageResource(R.drawable.ic_annotation)
                        icon.x = motionEvent.rawX
                        icon.y = motionEvent.rawY
                        relativeLayout.addView(icon)
                        linearLayout.x = icon.x
                        linearLayout.y = icon.y
                        linearLayout.visibility = View.VISIBLE
                    }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if(mode== 0 && annotation!= null){
                        val placeX = ((motionEvent.x - imageView.x) / imageView.width).toDouble()
                        val placeY = ((motionEvent.y - imageView.y) / imageView.height).toDouble()
                        annotation!!.w = (placeX - annotation!!.x)/ imageView.width
                        annotation!!.h = (placeY - annotation!!.y)/ imageView.height
                    }
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    if(mode == 0 && annotation!=null ){
                        val placeX = ((motionEvent.x - imageView.x) / imageView.width).toDouble()
                        val placeY = ((motionEvent.y - imageView.y) / imageView.height).toDouble()
                        if(placeX > annotation!!.x && placeY > annotation!!.y){
                            val lp = LinearLayout.LayoutParams(((placeX - annotation!!.x) * imageView.width).toInt(), ((placeY - annotation!!.y) * imageView.height).toInt())
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
        val call: Call<ListAnnotations> = AnnotationRetroClient.getInstance().annotationAPIService.getAnnotations(activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE).getString("user_cookie", "defaultCookie"), articleId)


        call.enqueue(object : Callback<ListAnnotations> {
            override fun onResponse(call: Call<ListAnnotations>, response: Response<ListAnnotations>) {
                if (response.isSuccessful) {
                    if(response.body()?.annotations!= null){
                        annotations = response.body()?.annotations!!
                    }
                    else{
                        annotations = mutableListOf()
                    }

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ListAnnotations>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    fun showAnnotations(){
        getAnnotations()
        for(icon in annotationIcons){
            icon.visibility = View.GONE
        }
        annotationIcons.clear()
        for(annotation in annotations){
            if(annotation.type == "image"){
                val lp = RelativeLayout.LayoutParams(30, 30)
                lp.addRule(RelativeLayout.CENTER_IN_PARENT)
                val imageView = ImageView(context) // initialize ImageView
                imageView.layoutParams = lp
                // imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
                imageView.setImageResource(R.drawable.ic_annotation)
                imageView.x = (imageView.x + (annotation.x * imageView.width)).toFloat()
                imageView.x = (imageView.y + (annotation.y * imageView.height)).toFloat()
                annotationIcons.add(imageView)
            }
        }
        for(icon in annotationIcons){
            relativeLayout.addView(icon)
        }
    }
}