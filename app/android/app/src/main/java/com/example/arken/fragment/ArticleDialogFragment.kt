package com.example.arken.fragment


import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.Fragment
import com.example.arken.R
import com.example.arken.model.Article
import com.example.arken.util.RetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

/**
 * A simple [Fragment] subclass.
 */
class ArticleDialogFragment : DialogFragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
      val rootView: View = inflater.inflate(R.layout.fragment_article_dialog,container, false)

        var submit_button = rootView.findViewById<Button>(R.id.submit_button)
        var cancel_button = rootView.findViewById<Button>(R.id.cancel_button)

        var title_editText = rootView.findViewById<EditText>(R.id.title_editText)
        var text_editText = rootView.findViewById<EditText>(R.id.text_editText)

        cancel_button.setOnClickListener(object :View.OnClickListener
        {
            override fun onClick(v: View?) {
               dismiss()
            }
        })

        submit_button.setOnClickListener(object :View.OnClickListener
        {
            override fun onClick(v: View?) {

                val call: Call<ResponseBody> = RetroClient.getInstance().apiService.createArticle(Article(text_editText.text.toString(),
                    title_editText.text.toString()))



                call.enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                        if (response.isSuccessful) {
                            Toast.makeText(context, "Article Created.", Toast.LENGTH_SHORT).show()


                        } else {
                            Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                    }
                })


            }
        })



        return rootView
    }


}
