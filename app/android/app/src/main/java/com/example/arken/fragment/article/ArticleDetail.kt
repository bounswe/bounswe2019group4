package com.example.arken.fragment.article

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.text.Editable
import android.text.method.KeyListener
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.arken.R
import com.example.arken.model.Article
import com.example.arken.util.RetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ArticleDetail : Fragment() {
    private lateinit var editButton: Button
    private lateinit var deleteButton: Button
    private lateinit var saveButton:Button
    private lateinit var title: TextView
    private lateinit var text: TextView
    private val args: ArticleDetailArgs by navArgs()
    private lateinit var prefs: SharedPreferences
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_article_details, container, false)
        title = rootView.findViewById(R.id.article_detail_title)
        text = rootView.findViewById(R.id.article_detail_text)
        saveButton=rootView.findViewById(R.id.articleeditsave)
        title.tag = title.keyListener
        title.keyListener = null
        text.tag = text.keyListener
        text.keyListener = null
        editButton = rootView.findViewById(R.id.edit_article_button)
        deleteButton = rootView.findViewById(R.id.delete_article_button)
        return rootView
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        prefs = getActivity()!!.getSharedPreferences("MyPrefsFile", Context.MODE_PRIVATE)
        val call: Call<Article> =
            RetroClient.getInstance().apiService.getArticle(
                prefs.getString("user_cookie", null),
                args.articleId
            )

        call.enqueue(object : Callback<Article> {
            override fun onResponse(call: Call<Article>, response: Response<Article>) {
                if (response.isSuccessful) {
                    val article: Article? = response.body()
                    title.text = article?.title
                    text.text = article?.text
                    setVisibility(article!!.userId!!)
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                        .show()
                }
            }

            override fun onFailure(call: Call<Article>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun setVisibility(userId: String) {
        if (userId == prefs.getString("userId", "")) {
            editButton.visibility = View.VISIBLE
            deleteButton.visibility = View.VISIBLE
            editButton.setOnClickListener { }
            deleteButton.setOnClickListener {
                val call: Call<ResponseBody> =
                    RetroClient.getInstance().apiService.deleteArticle(
                        prefs.getString("user_cookie", null),
                        args.articleId
                    )

                call.enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(
                        call: Call<ResponseBody>,
                        response: Response<ResponseBody>
                    ) {
                        if (response.isSuccessful) {
                            findNavController().popBackStack()

                        } else {
                            Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                                .show()
                        }
                    }

                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                    }
                })
            }

        }
    }

    private fun edit(){
        editButton.visibility = View.GONE
        deleteButton.visibility = View.GONE
        saveButton.visibility=View.VISIBLE
        saveButton.setOnClickListener {

        }
        title.keyListener = title.getTag() as KeyListener
    }
}