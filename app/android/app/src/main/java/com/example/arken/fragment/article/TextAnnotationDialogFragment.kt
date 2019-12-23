package com.example.arken.fragment.article

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import com.example.arken.R
import com.example.arken.model.Annotation
import com.example.arken.model.Article
import com.example.arken.model.tradingEquipment.AnnoCreateRequest
import com.example.arken.util.AnnotationRetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class TextAnnotationDialogFragment(
    var onAnnoClickListener: AnnoClickListener,
    val toCreate: Boolean,
    val article:Article,
    val start:Int?,
    val end:Int?
) : DialogFragment() {

    private lateinit var prefs: SharedPreferences
    private lateinit var edit_button: Button
    private lateinit var delete_button: Button
    private lateinit var add_button: Button
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val rootView: View = inflater.inflate(R.layout.dialog_text_annotation, container, false)

        var anno_editText = rootView.findViewById<EditText>(R.id.text_add_annotation_edittext)

        edit_button = rootView.findViewById<Button>(R.id.text_anno_edit_button)
        delete_button = rootView.findViewById<Button>(R.id.text_anno_delete_button)
        add_button = rootView.findViewById<Button>(R.id.text_anno_add_button)
        if (!toCreate) {

            edit_button.setOnClickListener(object : View.OnClickListener {
                override fun onClick(v: View?) {
                    dismiss()
                }
            })
            delete_button.setOnClickListener(object : View.OnClickListener {
                override fun onClick(v: View?) {
                    dismiss()
                }
            })
        } else {


            add_button.setOnClickListener(object : View.OnClickListener {
                override fun onClick(v: View?) {
                    val a:Annotation= Annotation()
                    a.annotationText=anno_editText.text.toString()
                    a.articleId=article._id
                    a.userId=prefs.getString("userId",null)
                    a.type="Text"
                    a.startIndex=start
                    a.finishIndex=end
                    val call: Call<ResponseBody> = AnnotationRetroClient.getInstance().annotationAPIService.createAnnotation(prefs.getString("user_cookie",null),
                        AnnoCreateRequest(
                            "http://www.w3.org/ns/anno.jsonld",
                            "Annotation",
                            a,
                            "http://www.example.com/index.htm",
                            article._id!!
                        )
                    )
                    call.enqueue(object : Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                            if (response.isSuccessful) {
                                System.out.println("Successfull")

                            } else {
                                Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                                    .show()
                            }
                        }

                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                            Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                        }
                    })
                    dismiss()
                }
            })
        }
        return rootView
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        prefs = getActivity()!!.getSharedPreferences("MyPrefsFile", Context.MODE_PRIVATE)
        setVisibilty(prefs.getString("userId",null),toCreate)
    }
    private fun setVisibilty(k:String?,t:Boolean){
        if(k !=null){
            if(t){
                add_button.visibility=View.VISIBLE
            }
        }else{
            dismiss()
        }
    }
}




interface AnnoClickListener {
    fun onAnnoClick()
}